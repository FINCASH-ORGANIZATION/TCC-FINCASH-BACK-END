import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { pesUsuIdService } from "../services/Usuario.service.js";

dotenv.config();

// Parte onde faz a autenticação e autorização do usuário, assim que autorizado, todo o acesso que ele tem dentro do servidor será liberado.
export const authMiddlewares = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.send(401);
        }

        const particao = authorization.split(" ");

        if (particao.length !== 2) {
            return res.status(401);
        }

        const [schema, token] = particao;

        if (schema !== "Bearer") {
            return res.send(401);
        }

        // Função de validação do Id do usuário. Lembrando que por mais que o token seja válido em questão de caracteres, ele tem uma duração
        // que permita que ele seja válido para ser autenticado.
        jwt.verify(token, process.env.CHAVE_JWT, async (error, decoded) => {
            if (error) {
                console.log(error)
                return res.status(401).send({ mensagem: "Token Inválido!" });
            }
            // Faz a validação para ver se o usuário existe e tira o objeto dele (neste caso o objeto  está dentro do decoded, ou seja, o Id)
            const Usuario = await pesUsuIdService(decoded.id);

            if (!Usuario || !Usuario.id) {
                return res.status(401).send({ mensagem: "Token Inválido!" });
            }
            // Recebe o objeto (Id) e envia para o 'Usuario',assim é devolvido para o banco, assim terá acesso ao Id do Usuário que está logado.
            req.UsuarioId = Usuario._id;

            return next();
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    };
};