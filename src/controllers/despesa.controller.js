import {
  criarDespesaService,
  pesDespesaIdService,
  despesaDescricaoService,
  atualizarDespesaService,
  deletarDespesaService,
  pesDespesaService,
} from "../services/despesa.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from "../models/Usuario.js";
import Conta from "../models/conta.js";
import mongoose from "mongoose";

// Função para criar despesa
export const criarDespesa = async (req, res) => {
  try {
    const { descricao, valor, data, categoria, contaId } = req.body; // Aqui estou assumindo que o ID da conta é enviado como 'contaId'

    console.log("Dados recebidos:", req.body); // Log dos dados recebidos

    if (!descricao || !valor || !data || !categoria || !contaId) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos!" });
    }

    const contaExistente = await Conta.findById(contaId);
    if (!contaExistente) {
      return res.status(400).send({ mensagem: "Conta não encontrada!" });
    }

    console.log("Conta encontrada:", contaExistente); // Log da conta encontrada

    // Calcula o saldo atual do usuário
    const saldoAtual = await calcularSaldo(req.UsuarioId); // Certifique-se de que esta função está implementada corretamente

    console.log("Saldo atual:", saldoAtual); // Log do saldo atual

    // Verifica se o saldo atual é suficiente para a despesa
    if (saldoAtual < valor) {
      return res
        .status(400)
        .send({ mensagem: "Saldo insuficiente para realizar a despesa!" });
    }

    // Cria a nova despesa
    const novaDespesa = await criarDespesaService({
      descricao,
      valor,
      data,
      categoria,
      conta: contaId,
      usuario: req.UsuarioId,
    });

    console.log("Nova despesa criada:", novaDespesa); // Log da nova despesa criada

    // Atualiza o saldo do usuário subtraindo o valor da despesa
    const novoSaldo = saldoAtual - valor;
    await Usuario.findOneAndUpdate(
      { _id: req.UsuarioId },
      { $set: { saldo: novoSaldo } },
      { new: true }
    );

    console.log("Saldo atualizado:", novoSaldo); // Log do saldo atualizado

    res
      .status(200)
      .send({ mensagem: "Uma nova despesa foi feita!", despesa: novaDespesa });
  } catch (error) {
    console.error("Erro ao criar despesa:", error); // Log de erro
    res.status(500).send({ mensagem: error.message });
  }
};


/* Função que retorna todas as despesas que estão na sua conta */

export const pesDespesaRota = async (req, res) => {
  try {
    const usuarioId = req.UsuarioId;

    // Chama o serviço para obter todas as despesas do usuário, passando o ID do usuário
    const despesas = await pesDespesaService(usuarioId);

    // Verifica se encontrou despesas para o usuário
    if (!despesas || despesas.length === 0) {
      return res
        .status(404)
        .send({ message: "Nenhuma despesa encontrada para o usuário." });
    }

    // Formata as despesas para enviar na resposta
    const resultadosFormatados = despesas.map((despesa) => ({
      id: despesa._id,
      descricao: despesa.descricao,
      valor: despesa.valor,
      data: despesa.data,
      categoria: despesa.categoria,
      conta: despesa.conta,
      usuario: despesa.Usuario
        ? despesa.Usuario.nome
        : "Usuário não encontrado!", // Exemplo: supondo que o usuário tenha um campo 'nome'
    }));

    res.send({ results: resultadosFormatados });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
export const despesaId = async (req, res) => {
  try {
    const { id } = req.params;

    const despesa = await pesDespesaIdService(id);
    if (!despesa) {
      return res.status(404).send({ mensagem: "Despesa não encontrada" });
    }

    res.send({
      id: despesa._id,
      descricao: despesa.descricao,
      valor: despesa.valor,
      data: despesa.data,
      categoria: despesa.categoria,
      conta: despesa.conta,
      usuario: despesa.Usuario ? despesa.Usuario : "Usuário não encontrado!",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const despesaDescricaoRota = async (req, res) => {
  try {
    const { descricao } = req.query;

    const despesa = await despesaDescricaoService(descricao);

    if (despesa.length === 0) {
      return res.status(400).send({ mensagem: "Despesa não encontrada" });
    }

    res.send({
      results: despesa.map((item) => ({
        id: item._id,
        descricao: item.descricao,
        valor: item.valor,
        data: item.data,
        categoria: item.categoria,
        conta: item.conta,
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* Função para o usuário atualizar os dados de dentro da despesa que ele estiver manipulando */
export const atualizarDespesa = async (req, res) => {
  try {
    const { descricao, valor, data, categoria, conta } = req.body;
    const { id } = req.params;

    // Busca a despesa pelo ID
    const despesaExistente = await pesDespesaIdService(id);

    // Verifica se a despesa existe
    if (!despesaExistente) {
      return res.status(404).send({ mensagem: "Despesa não encontrada" });
    }

    // Verifica se houve alterações nos campos
    const camposAlterados = Object.keys(req.body).filter(
      (key) => req.body[key] !== despesaExistente[key]
    );

    // Se não houver alterações, retorna um erro
    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    // Atualiza a despesa com os novos valores
    await atualizarDespesaService(id, descricao, valor, data, categoria, conta);

    // Recalcula o saldo após a atualização da despesa
    const saldoAtualizado = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo: saldoAtualizado });

    // Retorna uma mensagem de sucesso
    res.status(200).send({ mensagem: "Despesa atualizada com sucesso!" });
  } catch (error) {
    // Trata os erros
    res.status(500).send({ mensagem: error.message });
  }
};

/* Função para deletar as despesa */
export const deletarDespesa = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!objectId) {
      return res.status(400).send({ mensagem: "Id da despesa inválido" });
    }

    const despesa = await deletarDespesaService(objectId);
    if (!despesa) {
      return res.status(404).send({ mensagem: "despesa não encontrada" });
    }

    if (despesa.Usuario._id.toString() != req.UsuarioId) {
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa despesa",
      });
    }

    await deletarDespesaService(objectId);

    res.status(200).send({ mensagem: "Despesa deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
