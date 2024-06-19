import {
  criarDespesaService,
  pesDespesaService,
  pesDespesaIdService,
  despesaDescricaoService,
  atualizarDespesaService,
  deletarDespesaService,
} from "../services/despesa.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";

/* Função criar despesa */
export const criarDespesa = async (req, res) => {
  try {
    const { descricao, valor, data, categoria, conta } = req.body;

    if (!descricao || !valor || !data || !categoria || !conta) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos!" });
    }

    const novaDespesa = await criarDespesaService({
      descricao,
      valor,
      data,
      categoria,
      conta,
      Usuario: req.UsuarioId,
    });

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({ mensagem: "Uma Nova despesa foi feita!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* Função que retorna todas as despesas cadastradas no banco de dados de todos os usuários */
export const pesDespesaRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    const despesa = await pesDespesaService(id);

    res.send({
      results: despesa.map((item) => ({
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

/* Função que retorna para o usuário todas as despesas da sua conta */
export const despesaId = async (req, res) => {
  try {
    const id = req.UsuarioId;

    const despesa = await pesDespesaIdService(id);

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
    const {
      descricao,
      valor,
      data,
      categoria,
      conta,
    } = req.body;
    const { id } = req.params;

    const despesa = await pesIDService(id);
    if (!despesa) {
      return res.status(404).send({ mensagem: "Despesa não encontrada" });
    }

    /* if (despesa.Usuario._id.toString() !== req.UsuarioId) {
            return res.status(403).send({ mensagem: 'Você não tem permissão para atualizar essa despesa' });
        } */

    const camposAlterados = Object.keys(req.body).filter(
      (key) => req.body[key] !== despesa[key]
    );

    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    await atualizarDespesaService(
      id,
      descricao,
      valor,
      data,
      categoria,
      conta,
    );

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({ mensagem: "Despesa atualizada com sucesso!" });
  } catch (error) {
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
      return res.status(400).send({ mensagem: "ID da despesa inválido" });
    }

    const despesa = await pesIDService(objectId);
    if (!despesa) {
      return res.status(404).send({ mensagem: "despesa não encontrada" });
    }

    if (despesa.Usuario._id.toString() != req.UsuarioId) {
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa despesa",
      });
    }

    await deletarDespesaService(objectId);

    res.status(200).send({ mensagem: "despesa deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};