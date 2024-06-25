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

    // Verificar se o usuário já possui uma conta com o mesmo banco
    const contaExistente = await Conta.findOne({
      Usuario: req.UsuarioId,
      banco,
    });
    if (contaExistente) {
      return res
        .status(400)
        .send({ mensagem: `Você já possui uma conta no banco ${banco}.` });
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
    console.error("Erro ao criar conta do banco:", error);
    res.status(500).send({ mensagem: error.message });
  }
};

// Obter todas as contas
export const pesContaRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    // Verificar se o usuário existe no banco de dados
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).send({ mensagem: "Usuário não encontrado!" });
    }

    const contas = await pesContaService(id);

    res.send({
      results: contas.map((item) => ({
        id: item._id,
        banco: item.banco,
        Usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    res.status(500).send({ mensagem: error.message });
  }
};

// Obter uma conta por ID
export const pesContaIdRota = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ mensagem: "ID inválido!" });
    }

    const conta = await pesContaIdService(id);

    if (!conta) {
      return res.status(404).send({ mensagem: "Conta não encontrada!" });
    }

    // Verificar se a conta pertence ao usuário autenticado
    if (conta.Usuario.toString() !== req.UsuarioId) {
      return res.status(403).send({ mensagem: "Acesso negado!" });
    }

    res.send({
      id: conta._id,
      banco: conta.banco,
      Usuario: conta.Usuario ? conta.Usuario : "Usuário não encontrado!",
    });
  } catch (error) {
    console.error("Erro ao buscar conta por ID:", error);
    res.status(500).send({ mensagem: error.message });
  }
};

// Deletar uma conta
export const deletarConta = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ mensagem: "ID inválido!" });
    }

    const contaDeletada = await deletarContaService(id);

    if (!contaDeletada) {
      return res.status(404).send({ mensagem: "Conta não encontrada" });
    }

    // Verificar se a conta pertence ao usuário autenticado
    if (contaDeletada.Usuario.toString() !== req.UsuarioId) {
      return res.status(403).send({ mensagem: "Acesso negado!" });
    }

    res.status(200).send({ mensagem: "Conta deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    res.status(500).send({ mensagem: error.message });
  }
};
