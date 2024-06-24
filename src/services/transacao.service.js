import transacao from "../models/transacao.js";
import Conta from "../models/conta.js"; // Certifique-se de importar o modelo de conta
import mongoose from "mongoose";
import moment from "moment"; // Importa a biblioteca moment

export const criartranService = async (dadosTransacao) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();

    // Verifica se a categoria está presente nos dados da transação
    if (!dadosTransacao.categoria) {
      throw new Error(
        "Categoria é um campo obrigatório para criar uma transação."
      );
    }

    // Converte a data para o formato correto
    if (dadosTransacao.data) {
      dadosTransacao.data = moment(dadosTransacao.data, "DD/MM/YYYY").toDate();
    }

    // Cria uma nova transação usando o modelo Transacao
    const novaTransacao = new transacao({
      ...dadosTransacao,
      Usuario: dadosTransacao.Usuario, // Passa o ID do usuário
    });

    // Salva a transação no banco de dados
    const resultado = await novaTransacao.save({ session });

    // Atualiza o saldo da conta
    const conta = await Conta.findById(dadosTransacao.conta).session(session);
    if (!conta) {
      throw new Error("Conta não encontrada");
    }

    if (dadosTransacao.tipoTransacao === "Receita") {
      conta.saldo += dadosTransacao.valor;
    } else if (dadosTransacao.tipoTransacao === "Despesa") {
      conta.saldo -= dadosTransacao.valor;
    }

    await conta.save({ session });

    await session.commitTransaction();
    session.endSession();

    return resultado;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(error.message);
    } else if (error instanceof mongoose.Error.CastError) {
      throw new Error("Id da categoria ou da conta inválido");
    }
    throw new Error("Erro ao processar a requisição.");
  }
};

export const pestraService = async (limit, offset) => {
  try {
    const resultado = await transacao
      .find()
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .populate("conta")
      .populate("Usuario");

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const contarTranService = async () => {
  try {
    const resultado = await transacao.countDocuments();

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const pesIDService = async (id) => {
  try {
    const resultado = await transacao
      .findById(id)
      .populate("conta")
      .populate("Usuario");

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const pesqDescricaoService = async (descricao, UsuarioId) => {
  try {
    console.log(
      "\x1b[31mPesquisando transações por descrição:\x1b[0m",
      descricao,
      "e Usuário ID:",
      UsuarioId
    );
    const resultado = await transacao
      .find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" },
        Usuario: UsuarioId,
      })
      .sort({ _id: -1 })
      .populate("conta")
      .populate("Usuario");

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const pesUsuarioService = async (id) => {
  try {
    const resultado = await transacao
      .find({ Usuario: id })
      .sort({ _id: -1 })
      .populate("conta")
      .populate("Usuario");

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const atualizarTransService = async (id, atualizacao) => {
  try {
    const resultado = await transacao.findOneAndUpdate(
      { _id: id },
      { ...atualizacao },
      { rawResult: true }
    );

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};

export const deletarTransService = async (id) => {
  try {
    const resultado = await transacao.findOneAndDelete({ _id: id });

    return resultado;
  } catch (error) {
    throw new Error("Erro ao processar a requisição.");
  }
};
