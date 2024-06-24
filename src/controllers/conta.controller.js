import Conta from "../models/conta.js";
import Usuario from "../models/Usuario.js";
import {
  criarContaService,
  pesContaService,
  pesContaIdService,
  deletarContaService,
} from "../services/conta.service.js";

// Rota para criar uma nova conta
export const criarConta = async (req, res) => {
  try {
    const { banco } = req.body;

    // Verifique se o campo banco está presente
    if (!banco) {
      return res.status(400).send({ mensagem: "Por favor, escolha um banco!" });
    }

    // Verificar se o banco escolhido é válido
    const bancosValidos = [
      "Banco do Brasil",
      "Caixa",
      "Itau",
      "Santander",
      "Nubank",
      "Bradesco",
      "Inter",
    ];
    if (!bancosValidos.includes(banco)) {
      return res.status(400).send({
        mensagem:
          "Banco inválido! Escolha entre: Banco do Brasil, Caixa, Itau, Santander, Nubank, Bradesco e Inter.",
      });
    }

    // Verificar se o usuário existe no banco de dados
    const usuarioExistente = await Usuario.findById(req.UsuarioId);
    if (!usuarioExistente) {
      return res.status(404).send({ mensagem: "Usuário não encontrado!" });
    }

    const novaConta = await criarContaService({
      banco,
      Usuario: req.UsuarioId,
    });

    res.status(201).send({
      mensagem: "Conta do banco criada com sucesso!",
      conta: novaConta,
    });
  } catch (error) {
    res.status(500).send({ mensagem: error.message });
  }
};

// Obter todas as contas
export const pesContaRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    const contas = await pesContaService(id);

    res.send({
      results: contas.map((item) => ({
        id: item._id,
        banco: item.banco,
        Usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Obter uma conta por ID
export const pesContaIdRota = async (req, res) => {
  try {
    const { id } = req.params;

    const conta = await pesContaIdService(id);

    if (!conta) {
      return res.status(404).send({ mensagem: "Conta não encontrada!" });
    }

    res.send({
      id: conta._id,
      banco: conta.banco,
      usuario: conta.usuario ? conta.usuario : "Usuário não encontrado!",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Deletar uma conta
export const deletarConta = async (req, res) => {
  try {
    const { id } = req.params;

    const contaDeletada = await deletarContaService(id);

    if (!contaDeletada) {
      return res.status(404).send({ message: "Conta não encontrada" });
    }

    res.status(200).send({ message: "Conta deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
