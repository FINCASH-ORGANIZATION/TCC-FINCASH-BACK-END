import Usuario from "../models/Usuario.js";

import {
  criarUsuService,
  pesUsuService,
  pesUsuIdService,
  atualizarUsuService,
  deletarUsuService,
} from "../services/Usuario.service.js";

export const criarUsu = async (req, res) => {
  try {
    const { nome, sobrenome, senha, email, avatar } = req.body;
    const Usuario = await criarUsuService(req.body);

    //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE;
    //      Erro 400, quando um campo não pode ser processado pelo servidor, erro de digitação do usuário
    if (!nome || !sobrenome || !senha || !email) {
      res.status(400).json({
        message: "Por favor, preencha todos os campos para se registrar!",
      });
    }

    //      DEVOLVE A MENSAGEM DE ERRO E STATUS PARA O BANCO E USUARIO
    if (!Usuario) {
      return res.status(400).send({ message: "Erro na criação do usuario" });
    }
    //      DEVOLVE PARA O USUARIO A RESPOSTA COM OS DADOS INSERIDOS E SE FOI REALMENTE CRIADO
    res.status(201).json({
      Mensagem: "Usuario cadastrado com sucesso!",
      Usuario: {
        id: Usuario._id,
        nome,
        sobrenome,
        email,
        senha,
        avatar,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const pesUsu = async (req, res) => {
  try {
    const Usuarios = await pesUsuService();

    if (Usuarios.length === 0) {
      return res.status(400).send({ mensagem: "Não há usuarios cadastrados" });
    }

    res.send(Usuarios);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const pesId = async (req, res) => {
  //Function de verificação de usuarios e a Id dos mesmos

  try {
    const { id } = req.params; // Supondo que o ID do usuário esteja nos parâmetros da rota

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).send({ mensagem: "Usuário não encontrado." });
    }

    // Retorna todas as propriedades do objeto usuario como resposta
    return res.status(200).send({ usuario });
  } catch (error) {
    res.status(500).send({ mensagem: "Erro interno no servidor." });
  }
};

// Função de verificação e pesquisa de usuário pelo Id
export const pesUsuId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.UsuarioId);

    if (!usuario) {
      return res.status(404).send({ mensagem: "Usuário não encontrado." });
    }

    return res.status(200).send({ usuario });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const UsuUpdate = async (req, res) => {
  try {
    const { id, Usuario } = req;
    const { nome, sobrenome, senha, email, avatar } = req.body;

    if (!nome && !sobrenome && !senha && !email && !avatar) {
      return res.status(400).json({
        mensagem: "Preencha pelo menos um campo para fazer a alteração!",
      });
    }

    const usuarioAtualizado = {
      nome: nome || Usuario.nome,
      sobrenome: sobrenome || Usuario.sobrenome,
      senha: senha || Usuario.senha,
      email: email || Usuario.email,
      avatar: avatar || Usuario.avatar,
    };

    if (
      usuarioAtualizado.nome === Usuario.nome &&
      usuarioAtualizado.sobrenome === Usuario.sobrenome &&
      usuarioAtualizado.senha === Usuario.senha &&
      usuarioAtualizado.email === Usuario.email &&
      usuarioAtualizado.avatar === Usuario.avatar
    ) {
      return res.status(400).json({
        mensagem:
          "Você precisa fazer alguma alteração para atualizar os dados!",
      });
    }

    await atualizarUsuService(
      id,
      usuarioAtualizado.nome,
      usuarioAtualizado.sobrenome,
      usuarioAtualizado.senha,
      usuarioAtualizado.email,
      usuarioAtualizado.avatar
    );

    res.send({ mensagem: "Usuario alterado com sucesso" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deletarUsu = async (req, res) => {
  try {
    const { id } = req.params;

    // Chamada para buscar o usuário pelo ID
    const Usuario = await pesUsuIdService(id);

    // Verifica se o usuário existe
    if (!Usuario) {
      return res.status(400).send({ mensagem: "Usuário não encontrado" });
    }

    // Verifica se o usuário que está tentando deletar a conta é o mesmo que a criou
    if (Usuario._id.toString() !== req.Usuario._id.toString()) {
      return res
        .status(403)
        .send({ mensagem: "Você não pode deletar esse usuário!" });
    }

    // Deleta o usuário
    await deletarUsuService(id);

    return res.status(200).send({ mensagem: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).send({ mensagem: error.message });
  }
};
