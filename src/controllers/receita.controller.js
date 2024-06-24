import { calcularSaldo } from "./saldo.controller.js";
import { criartranService } from "../services/transacao.service.js";
import { criarReceitaService, pesReceitaService, deletarReceitaService } from "../services/receita.service.js";
import Usuario from "../models/Usuario.js";
import Receita from "../models/receita.js";
import Conta from "../models/conta.js";
import mongoose from "mongoose";

export const criarReceita = async (req, res) => {
  try {
    console.log("Requisição recebida para criar uma nova receita:", req.body);

    const { valor, conta, categoria } = req.body;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!valor || !conta || !categoria || categoria === "") {
      console.log("Campos obrigatórios não preenchidos:", req.body);
      return res.status(400).send({
        mensagem:
          "Por favor, preencha todos os campos obrigatórios, incluindo a categoria!",
      });
    }

    console.log("Dados da receita a ser criada:", {
      valor,
      conta,
      categoria,
      Usuario: req.UsuarioId,
    });

    const usuarioExistente = await Usuario.findById(req.UsuarioId);
    if (!usuarioExistente) {
      console.log("Usuário não encontrado com ID:", req.UsuarioId);
      return res.status(404).send({ mensagem: "Usuário não encontrado!" });
    }

    if (!mongoose.Types.ObjectId.isValid(conta)) {
      console.log("ID da conta inválido:", conta);
      return res.status(400).send({ mensagem: "ID da conta inválido!" });
    }

    const contaExistente = await Conta.findById(conta);
    if (!contaExistente) {
      console.log("Conta não encontrada com ID:", conta);
      return res.status(404).send({ mensagem: "Conta não encontrada!" });
    }

    const novaReceita = new Receita({
      valor,
      categoria,
      conta,
      Usuario: req.UsuarioId,
    });

    console.log("Nova receita criada:", novaReceita);

    const receitaSalva = await novaReceita.save();

    console.log("Receita salva no banco de dados:", receitaSalva);

    const transacao = await criartranService({
      valor: receitaSalva.valor,
      data: receitaSalva.data,
      descricao: receitaSalva.descricao,
      tipoTransacao: "Receita",
      categoria: receitaSalva.categoria,
      conta: receitaSalva.conta,
      Usuario: receitaSalva.Usuario,
    });

    console.log("Transação criada com sucesso:", transacao);

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({
      mensagem: "Uma nova receita foi criada!",
      receita: receitaSalva,
      transacao,
    });
  } catch (error) {
    console.error("Erro ao criar receita:", error.message);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ mensagem: error.message });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};

export const pesReceitaRota = async (req, res) => {
  try {
    console.log("Pesquisando receitas do usuário com ID:", req.UsuarioId);

    const receita = await pesReceitaService(req.UsuarioId);

    console.log("Receitas encontradas:", receita);

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
    console.error("Erro ao pesquisar receitas:", error.message);
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};

export const deletarReceita = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Recebida solicitação para deletar receita com ID:", id);

    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!objectId) {
      console.log("ID da receita inválido:", id);
      return res.status(400).send({ mensagem: "Id da Receita inválido" });
    }

    const receita = await deletarReceitaService(objectId);
    if (!receita) {
      console.log("Receita não encontrada com ID:", id);
      return res.status(404).send({ mensagem: "Receita não encontrada" });
    }

    if (receita.Usuario._id.toString() !== req.UsuarioId) {
      console.log(
        "Usuário não tem permissão para deletar esta receita:",
        req.UsuarioId
      );
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa Receita",
      });
    }

    await deletarReceitaService(objectId);

    console.log("Receita deletada com sucesso:", receita);

    res.status(200).send({ mensagem: "Receita deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar receita:", error.message);
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ mensagem: "Id da Receita inválido" });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};
