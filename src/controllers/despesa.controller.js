import { calcularSaldo } from "./saldo.controller.js";
import { criartranService } from "../services/transacao.service.js";
import {
  criarDespesaService,
  pesDespesaService,
  deletarDespesaService,
} from "../services/despesa.service.js";
import Usuario from "../models/Usuario.js";
import Despesa from "../models/despesa.js";
import Conta from "../models/conta.js";
import mongoose from "mongoose";

export const criarDespesa = async (req, res) => {
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

    const novaDespesa = new Despesa({
      valor,
      categoria,
      conta,
      Usuario: req.UsuarioId,
    });

    const despesaSalva = await novaDespesa.save();

    const transacao = await criartranService({
      valor: despesaSalva.valor,
      data: despesaSalva.data,
      descricao: despesaSalva.descricao,
      tipoTransacao: "Despesa",
      categoria: despesaSalva.categoria,
      conta: despesaSalva.conta,
      Usuario: despesaSalva.Usuario,
    });

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({
      mensagem: "Uma nova despesa foi criada!",
      despesa: despesaSalva,
      transacao,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ mensagem: error.message });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};

export const pesDespesaRota = async (req, res) => {
  try {
    const despesa = await pesDespesaService(req.UsuarioId);

    res.send({
      results: despesa.map((item) => ({
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

export const deletarDespesa = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!objectId) {
      return res.status(400).send({ mensagem: "Id da Despesa inválido" });
    }

    const despesa = await deletarDespesaService(objectId);
    if (!despesa) {
      return res.status(404).send({ mensagem: "despesa não encontrada" });
    }

    if (despesa.Usuario._id.toString() !== req.UsuarioId) {
      console.log(
        "Usuário não tem permissão para deletar esta despesa:",
        req.UsuarioId
      );
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa despesa",
      });
    }

    await deletarDespesaService(objectId);

    res.status(200).send({ mensagem: "Despesa deletada com sucesso!" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ mensagem: "Id da Despesa inválido" });
    }
    res.status(500).send({ message: "Erro ao processar a requisição." });
  }
};
