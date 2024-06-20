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

/* Função que para pesquisar uma despesa pela seu Id */
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