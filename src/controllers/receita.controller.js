import {
  criarReceitaService,
  pesIDService,
  pesReceitaService,
  pesReceitaIdService,
  atualizarReceitaService,
  deletarReceitaService,
} from "../services/transacao.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";

/* Função criar receita */
export const criarReceita = async (req, res) => {
  try {
    const { descricao, valor, data, categoria, conta } = req.body;

    if (!descricao || !valor || !data || !categoria || !conta) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos!" });
    }

    const novaReceita = await criarReceitaService({
      descricao,
      valor,
      data,
      categoria,
      conta,
      Usuario: req.UsuarioId,
    });

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({ mensagem: "Uma Nova receita foi feita!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* Função que retorna para o usuário todas as receitas que da sua conta */
export const pesReceitaRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    const despesa = await pesReceitaService(id);

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

/* Função para pesquisar a receita pelo id */
export const receitaId = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await pesReceitaIdService(id);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    res.send({
      transacao: {
        id: transacao._id,
        valor: transacao.valor,
        data: transacao.data,
        descricao: transacao.descricao,
        tipoTransacao: transacao.tipoTransacao,
        categoria: transacao.categoria,
        formaPagamento: transacao.formaPagamento,
        conta: transacao.conta,
        notas: transacao.notas,
        usuario: transacao.Usuario
          ? transacao.Usuario
          : "Usuário não encontrado!",
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* Função para o usuário atualizar os dados de dentro da receita que ele estiver manipulando */
export const atualizarReceita = async (req, res) => {
  try {
    const {
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
      categoriaPersonalizada,
    } = req.body;
    const { id } = req.params;

    const tiposValidos = ["Despesa", "Receita"];
    if (!tiposValidos.includes(tipoTransacao)) {
      return res.status(400).send({ mensagem: "Tipo de transação inválido!" });
    }

    const transacao = await pesIDService(id);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    /* if (transacao.Usuario._id.toString() !== req.UsuarioId) {
            return res.status(403).send({ mensagem: 'Você não tem permissão para atualizar essa transação' });
        } */

    const camposAlterados = Object.keys(req.body).filter(
      (key) => req.body[key] !== transacao[key]
    );

    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    await atualizarReceitaService(
      id,
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
      categoriaPersonalizada
    );

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({ mensagem: "Transação atualizada com sucesso!" });
  } catch (error) {
    res.status(500).send({ mensagem: error.message });
  }
};

/* Função para deletar as receita */
export const deletarReceita = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!objectId) {
      return res.status(400).send({ mensagem: "ID de transação inválido" });
    }

    const transacao = await pesIDService(objectId);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    if (transacao.Usuario._id.toString() != req.UsuarioId) {
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa transação",
      });
    }

    await deletarReceitaService(objectId);

    res.status(200).send({ mensagem: "Transação deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};