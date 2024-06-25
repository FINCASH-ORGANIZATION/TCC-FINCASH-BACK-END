import {
  pesReceitaIdService,
  receitaDescricaoService,
  atualizarReceitaService,
  deletarReceitaService,
  pesReceitasPorUsuarioIdService,
} from "../services/receita.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from "../models/Usuario.js";
import Receita from "../models/receita.js";
import Conta from "../models/conta.js";
import { criartranService } from "../services/transacao.service.js";
import mongoose from "mongoose";
import categoriaTransacao from "../models/categoriaTransacao.js"; // Corrigido para categoriaTransacao

// Função para remover acentos e padronizar string
const removerAcentos = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const criarReceita = async (req, res) => {
  try {
    const { valor, descricao, data, categoria, conta } = req.body;

    // Verifique se todos os campos obrigatórios estão presentes
    if (!valor || !conta || conta === "") {
      return res.status(400).send({
        mensagem: "Por favor, preencha todos os campos obrigatórios!",
      });
    }

    // Verificar se o usuário e a conta existem no banco de dados
    const UsuarioExistente = await Usuario.findById(req.UsuarioId);
    if (!UsuarioExistente) {
      return res.status(404).send({ mensagem: "Usuário não encontrado!" });
    }

    const contaExistente = await Conta.findById(conta);
    if (!contaExistente) {
      return res.status(404).send({ mensagem: "Conta não encontrada!" });
    }

    // Busca ou cria a categoria de forma case-insensitive e sem acentos
    let categoriaObj = await categoriaTransacao.findOne({
      tipo: { $regex: new RegExp(`^${removerAcentos(categoria)}$`, "i") },
    });

    if (!categoriaObj) {
      console.log(`Categoria "${categoria}" não encontrada. Tentando criar...`);

      categoriaObj = new categoriaTransacao({
        tipo: categoria,
        Usuario: req.UsuarioId,
      });

      await categoriaObj.save();
      console.log('Categoria criada:', categoriaObj);
    }

    const novaReceita = new Receita({
      valor,
      descricao,
      data,
      categoria: categoriaObj._id,
      Usuario: req.UsuarioId,
      conta,
    });

    await novaReceita.save();

    // Criar transação automaticamente com base na receita criada
    const transacao = await criartranService({
      valor: novaReceita.valor,
      data: novaReceita.data,
      descricao: novaReceita.descricao,
      tipoTransacao: "receita",
      categoria: novaReceita.categoria,
      conta: novaReceita.conta,
      Usuario: novaReceita.Usuario,
    });

    // Calcular e atualizar o saldo do usuário
    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({
      mensagem: "Uma nova receita foi criada!",
      receita: novaReceita,
      transacao,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

/* Função que retorna para o usuário todas as receitas que estão na sua conta */
export const pesReceitaRota = async (req, res) => {
  try {
    const UsuarioId = req.UsuarioId;

    // Chama o serviço para obter todas as receitas do usuário, populando os usuários associados
    const receitas = await pesReceitasPorUsuarioIdService(UsuarioId);

    // Formata as receitas para enviar na resposta
    const resultadosFormatados = receitas.map((receita) => ({
      id: receita._id,
      descricao: receita.descricao,
      valor: receita.valor,
      data: receita.data,
      categoria: receita.categoria,
      conta: receita.conta,
      Usuario: receita.Usuario
        ? receita.Usuario.nome
        : "Usuário não encontrado!", // Exemplo: supondo que o usuário tenha um campo 'nome'
    }));

    res.send({ results: resultadosFormatados });
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
      Usuario: receita.Usuario ? receita.Usuario : "Usuário não encontrado!",
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
        Usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
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
      (key) => req.body[key] !== receitaExistente[key]
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
