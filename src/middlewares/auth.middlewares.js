import jwt from 'jsonwebtoken';
import { pesUsuIdService } from '../services/Usuario.service.js';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddlewares = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      console.log('Token não fornecido!');
      return res.status(401).send({ mensagem: 'Token não fornecido!' });
    }

    const particao = authorization.split(' ');

    if (particao.length !== 2) {
      console.log('Formato de token inválido:', authorization);
      return res.status(401).send({ mensagem: 'Formato de token inválido!' });
    }

    const [schema, token] = particao;

    if (schema !== 'Bearer') {
      console.log('Esquema de autenticação inválido:', schema);
      return res.status(401).send({ mensagem: 'Esquema de autenticação inválido!' });
    }

    console.log('Token recebido:', token); // Verifica se o token está sendo recebido corretamente

    jwt.verify(token, process.env.CHAVE_JWT, async (error, decoded) => {
      if (error) {
        console.log('Erro ao verificar token:', error);
        return res.status(401).send({ mensagem: 'Token Inválido!' });
      }

      console.log('Token válido. Decoded:', decoded);

      // Busca os detalhes do usuário pelo ID contido no token
      const usuario = await pesUsuIdService(decoded.id);

      if (!usuario || !usuario._id) {
        console.log('Usuário não encontrado para o ID:', decoded.id);
        return res.status(401).send({ mensagem: 'Usuário não encontrado!' });
      }

      console.log('Usuário autenticado:', usuario);

      // Armazena o ID do usuário na requisição para uso posterior
      req.UsuarioId = usuario._id;

      next();
    });
  } catch (error) {
    console.error('Erro interno no servidor:', error);
    res.status(500).send({ mensagem: 'Erro interno no servidor.' });
  }
};