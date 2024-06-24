import { calcularSaldo } from "./saldo.controller.js";
import { criartranService } from "../services/transacao.service.js";
import {
  criarReceitaService,
  pesReceitaService,
  deletarReceitaService,
} from "../services/receita.service.js";
import Usuario from "../models/Usuario.js";
import Receita from "../models/receita.js";
import Conta from "../models/conta.js";
import mongoose from "mongoose";

export const criarReceita = async (req, res) => {
  try {
    const { valor, conta, categoria } = req.body;

    if (!valor || !conta || !categoria || categoria === "") {
      return res.status(400).send({
        mensagem:
          "Por favor, preencha todos os campos obrigatórios, incluindo a categoria!",
      });
    }

    const usuarioExistente = await Usuario.findById(req.UsuarioId);
    if (!usuarioExistente) {
      return res.status(404).send({ mensagem: "Usuário não encontrado!" });
    }

    if (!mongoose.Types.ObjectId.isValid(conta)) {
      return res.status(400).send({ mensagem: "ID da conta inválido!" });
    }

    const contaExistente = await Conta.findById(conta);
    if (!contaExistente) {
      return res.status(404).send({ mensagem: "Conta não encontrada!" });
    }

    const novaReceita = new Receita({
      valor,
      categoria,
      conta,
      Usuario: req.UsuarioId,
    });

    const receitaSalva = await novaReceita.save();

    const transacao = await criartranService({
      valor: receitaSalva.valor,
      data: receitaSalva.data,
      descricao: receitaSalva.descricao,
      tipoTransacao: "Receita",
      categoria: receitaSalva.categoria,
      conta: receitaSalva.conta,
      Usuario: receitaSalva.Usuario,
    });

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({
      mensagem: "Uma nova receita foi criada!",
      receita: receitaSalva,
      transacao,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ mensagem: error.message });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};

export const pesReceitaRota = async (req, res) => {
  try {
    const receita = await pesReceitaService(req.UsuarioId);

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
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};

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

    res.status(200).send({ mensagem: "Receita deletada com sucesso!" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ mensagem: "Id da Receita inválido" });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};
