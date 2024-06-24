import transacao from "../models/transacao.js";
import mongoose from "mongoose";
import moment from "moment"; // Importa a biblioteca moment

export const criartranService = async (dadosTransacao) => {
  try {
    console.log("Dados da transação recebidos:", dadosTransacao);

    // Verifica se a categoria está presente nos dados da transação
    if (!dadosTransacao.categoria) {
      throw new Error("Categoria é um campo obrigatório para criar uma transação.");
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
    console.log("Transação antes de salvar:", novaTransacao);

    // Salva a transação no banco de dados
    const resultado = await novaTransacao.save();
    console.log("Resultado do salvamento:", resultado);

    return resultado;
  } catch (error) {
    console.error(`Erro ao criar transação: ${error.message}`);
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(error.message);
    } else if (error instanceof mongoose.Error.CastError) {
      throw new Error("Id da categoria inválido");
    }
    throw new Error("Erro ao processar a requisição.");
  }
};

export const pestraService = (limit, offset) => {
  console.log("Pesquisando transações com limit:", limit, "e offset:", offset);
  return transacao.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate("conta")
    .populate("Usuario");
};

export const contarTranService = () => {
  console.log("Contando transações...");
  return transacao.countDocuments();
};

export const pesIDService = (id) => {
  console.log("Pesquisando transação por ID:", id);
  return transacao.findById(id).populate("conta").populate("Usuario");
};

export const pesqDescricaoService = (descricao, UsuarioId) => {
  console.log(
    "Pesquisando transações por descrição:",
    descricao,
    "e Usuário ID:",
    UsuarioId
  );
  return transacao.find({
    descricao: { $regex: `${descricao || ""}`, $options: "i" },
    Usuario: UsuarioId,
  })
    .sort({ _id: -1 })
    .populate("conta")
    .populate("Usuario");
};

export const pesUsuarioService = (id) => {
  console.log("Pesquisando transações por Usuário ID:", id);
  return transacao.find({ Usuario: id })
    .sort({ _id: -1 })
    .populate("conta")
    .populate("Usuario");
};

export const atualizarTransService = (id, atualizacao) => {
  console.log("Atualizando transação com ID:", id, "e dados:", atualizacao);
  return transacao.findOneAndUpdate(
    { _id: id },
    { ...atualizacao },
    { rawResult: true }
  );
};

export const deletarTransService = (id) => {
  console.log("Deletando transação com ID:", id);
  return transacao.findOneAndDelete({ _id: id });
};
