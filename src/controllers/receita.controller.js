import {
  criarReceitaService,
  pesReceitaService,
  pesReceitaIdService,
  receitaDescricaoService,
  atualizarReceitaService,
  deletarReceitaService,
} from "../services/receita.service.js";
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

    res.status(200).send({ mensagem: "Uma Nova receita foi feita!", receita: novaReceita });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/* Função que retorna para o usuário todas as receitas que estão na sua conta */
export const pesReceitaRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    const receita = await pesReceitaService(id);

    res.send({
      results: receita.map((item) => ({
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

    const receita = await pesReceitaIdService(id);
    if (!receita) {
      return res.status(404).send({ mensagem: "Receita não encontrada" });
    }

    res.send({
      id: receita._id,
      descricao: receita.descricao,
      valor: receita.valor,
      data: receita.data,
      categoria: receita.categoria,
      conta: receita.conta,
      usuario: receita.Usuario ? receita.Usuario : "Usuário não encontrado!",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const receitaDescricaoRota = async (req, res) => {
  try {
    const { descricao } = req.query;

    const receita = await receitaDescricaoService(descricao);

    if (receita.length === 0) {
      return res.status(400).send({ mensagem: "Receita não encontrada" });
    }

    res.send({
      results: receita.map((item) => ({
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

/* Função para o usuário atualizar os dados de dentro da receita que ele estiver manipulando */
export const atualizarReceita = async (req, res) => {
  try {
    const { descricao, valor, data, categoria, conta } = req.body;
    const { id } = req.params;

    // Busca a receita pelo ID
    const receitaExistente = await pesReceitaIdService(id);

    // Verifica se a receita existe
    if (!receitaExistente) {
      return res.status(404).send({ mensagem: "Receita não encontrada" });
    }

    // Verifica se houve alterações nos campos
    const camposAlterados = Object.keys(req.body).filter(
      key => req.body[key] !== receitaExistente[key]
    );

    // Se não houver alterações, retorna um erro
    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    // Atualiza a receita com os novos valores
    await atualizarReceitaService(id, descricao, valor, data, categoria, conta);

    // Recalcula o saldo após a atualização da receita
    const saldoAtualizado = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo: saldoAtualizado });

    // Retorna uma mensagem de sucesso
    res.status(200).send({ mensagem: "Receita atualizada com sucesso!" });
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
      return res.status(400).send({ mensagem: "Id da Receita inválido" });
    }

    const receita = await deletarReceitaService(objectId);
    if (!receita) {
      return res.status(404).send({ mensagem: "Receita não encontrada" });
    }

    if (receita.Usuario._id.toString() != req.UsuarioId) {
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa Receita",
      });
    }

    await deletarReceitaService(objectId);

    res.status(200).send({ mensagem: "Receita deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};