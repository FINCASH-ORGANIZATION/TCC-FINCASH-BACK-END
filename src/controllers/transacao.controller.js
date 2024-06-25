import categoriaTransacao from "../models/categoriaTransacao.js";
import {
  criartranService,
  pestraService,
  contarTranService,
  pesIDService,
  pesqDescricaoService,
  pesUsuarioService,
  atualizarTransService,
  deletarTransService,
} from "../services/transacao.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";
import transacao from "../models/transacao.js";

/* Função criar transação */
export const criarTransacaoRota = async (req, res) => {
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

    // Verifica se todos os campos necessários foram fornecidos na requisição
    if (!valor || !data || !tipoTransacao || !categoria || !conta) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos obrigatórios!" });
    }

    let categoriaObj;

    // Verifica se a categoria é "Outros" e se uma categoria personalizada foi fornecida
    if (categoria.toLowerCase() === "outros" && categoriaPersonalizada) {
      categoriaObj = new categoriaTransacao({
        tipo: categoria,
        categoriaPersonalizada,
        Usuario: req.UsuarioId,
      });

      await categoriaObj.save();
    } else {
      // Busca a categoria no banco de dados utilizando expressão regular para ignorar maiúsculas e minúsculas
      categoriaObj = await categoriaTransacao.findOne({ tipo: { $regex: new RegExp(`^${categoria}$`, 'i') } });

      if (!categoriaObj) {
        console.log(`Categoria "${categoria}" não encontrada. Tentando criar...`);

        categoriaObj = new categoriaTransacao({
          tipo: categoria,
          Usuario: req.UsuarioId,
        });

        await categoriaObj.save();
        console.log('Categoria criada:', categoriaObj);
      }
    }

    // Cria a nova transação
    const novaTransacao = await criartranService({
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria: categoriaObj._id,
      formaPagamento,
      conta,
      notas,
      Usuario: req.UsuarioId,
    });

    // Busca a transação completa (incluindo detalhes da categoria e do usuário)
    const transacaoCompleta = await transacao.findById(novaTransacao._id)
      .populate('categoria')
      .populate('Usuario');

    // Retorna a resposta de sucesso com os detalhes da transação criada
    return res.status(201).send({
      mensagem: "Transação criada com sucesso",
      transacao: transacaoCompleta,
    });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return res.status(500).send({ mensagem: "Erro ao processar a transação." });
  }
};

/* Função que retorna todas as transações cadastradas no banco de dados de todos os usuários */
export const pesTransacaoRota = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit) || 15;
    offset = Number(offset) || 0;

    console.log(`Pesquisando transações com limit=${limit}, offset=${offset}`);

    const transacao = await pestraService(limit, offset);
    const total = await contarTranService();
    const currentURL = req.baseUrl;

    const avancar = offset + limit;
    const avancarURL =
      avancar < total
        ? `${currentURL}?limit=${limit}&offset=${avancar}`
        : "Sem registros!";

    const anterior = offset - limit < 0 ? null : offset - limit;
    const antigaURL =
      anterior != null
        ? `${currentURL}?limit=${limit}&offset=${anterior}`
        : "Sem registros!";

    if (transacao.length === 0) {
      return res
        .status(400)
        .send({ mensagem: "Não há transações registradas!" });
    }

    res.send({
      avancarURL,
      antigaURL,
      limit,
      offset,
      total,
      results: transacao.map((item) => ({
        id: item._id,
        valor: item.valor,
        data: item.data,
        descricao: item.descricao,
        tipoTransacao: item.tipoTransacao,
        categoria: item.categoria,
        formaPagamento: item.formaPagamento,
        conta: item.conta,
        notas: item.notas,
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    console.error('Erro ao pesquisar transações:', error);
    res.status(500).send({ message: error.message });
  }
};

/* Função para pesquisar a transação pelo id */
export const pesquisaIDRota = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Pesquisando transação com ID=${id}`);

    const transacao = await pesIDService(id);
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
    console.error('Erro ao pesquisar transação por ID:', error);
    res.status(500).send({ message: error.message });
  }
};

/* Função para pesquisar a transação de acordo com a descrição */
export const pesDescricaoRotaId = async (req, res) => {
  try {
    const { descricao } = req.query;

    console.log("Descrição recebida:", descricao);
    console.log("ID do usuário:", req.UsuarioId);

    const transacao = await pesqDescricaoService(descricao, req.UsuarioId);

    console.log("Resultados da pesquisa:", transacao);

    if (transacao.length === 0) {
      console.log("Nenhuma transação encontrada.");
      return res
        .status(400)
        .send({ mensagem: "Transação não localizada no servidor!" });
    }

    res.send({
      results: transacao.map((item) => ({
        id: item._id,
        valor: item.valor,
        data: item.data,
        descricao: item.descricao,
        tipoTransacao: item.tipoTransacao,
        categoria: item.categoria,
        formaPagamento: item.formaPagamento,
        conta: item.conta,
        notas: item.notas,
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    console.error("Erro ao pesquisar transação por descrição:", error);
    res.status(500).send({ message: error.message });
  }
};

/* Função que retorna todas as transações do usuário */
export const pesUsuarioRota = async (req, res) => {
  try {
    const id = req.UsuarioId;

    console.log(`Pesquisando transações do usuário com ID=${id}`);

    const transacao = await pesUsuarioService(id);

    res.send({
      results: transacao.map((item) => ({
        id: item._id,
        valor: item.valor,
        data: item.data,
        descricao: item.descricao,
        tipoTransacao: item.tipoTransacao,
        categoria: item.categoria,
        formaPagamento: item.formaPagamento,
        conta: item.conta,
        notas: item.notas,
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    console.error('Erro ao pesquisar transações do usuário:', error);
    res.status(500).send({ message: error.message });
  }
};

/* Função para atualizar os dados da transação */
export const atualizarTrans = async (req, res) => {
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

    console.log(`Atualizando transação com ID=${id}`);
    console.log('Dados recebidos para atualização:', req.body);

    const tiposValidos = ["Despesa", "Receita"];
    if (!tiposValidos.includes(tipoTransacao)) {
      return res.status(400).send({ mensagem: "Tipo de transação inválido!" });
    }

    const transacao = await pesIDService(id);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    const camposAlterados = Object.keys(req.body).filter(
      (key) => req.body[key] !== transacao[key]
    );

    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    await atualizarTransService(
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
    console.error('Erro ao atualizar transação:', error);
    res.status(500).send({ mensagem: error.message });
  }
};

/* Função para deletar as transações */
export const deletarTrans = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Deletando transação com ID=${id}`);

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

    await deletarTransService(objectId);

    res.status(200).send({ mensagem: "Transação deletada com sucesso!" });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).send({ message: error.message });
  }
};
