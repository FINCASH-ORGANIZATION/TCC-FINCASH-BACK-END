import transacao from "../models/transacao.js";
import categoriaTransacao from "../models/categoriaTransacao.js";
import mongoose from "mongoose";

export const criartranService = async (dadosTransacao) => {
  try {
    console.log("Dados da transação recebidos:", dadosTransacao);

    // Verifica se a categoria está presente nos dados da transação
    if (!dadosTransacao.categoria) {
      throw new Error("Categoria é um campo obrigatório para criar uma transação.");
    }

    // Busca a categoriaTransacao pelo tipo
    const categoria = await categoriaTransacao.findOne({ tipo: dadosTransacao.categoria });
    if (!categoria) {
      throw new Error(`Categoria não encontrada para o tipo: ${dadosTransacao.categoria}`);
    }
    const categoriaId = categoria._id;

    // Cria uma nova transação usando o modelo Transacao
    const transacao = new Transacao({
      ...dadosTransacao,
      categoria: categoriaId, // Passa o ObjectId da categoriaTransacao
    });
    console.log("Transação antes de salvar:", transacao);

    // Salva a transação no banco de dados
    const resultado = await transacao.save();
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
  return Transacao.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate("categoria")
    .populate("Usuario");
};

export const contarTranService = () => {
  console.log("Contando transações...");
  return Transacao.countDocuments();
};

export const pesIDService = (id) => {
  console.log("Pesquisando transação por ID:", id);
  return Transacao.findById(id).populate("categoria").populate("Usuario");
};

export const pesqDescricaoService = (descricao, UsuarioId) => {
  console.log(
    "Pesquisando transações por descrição:",
    descricao,
    "e Usuário ID:",
    UsuarioId
  );
  return Transacao.find({
    descricao: { $regex: `${descricao || ""}`, $options: "i" },
    Usuario: UsuarioId,
  })
    .sort({ _id: -1 })
    .populate("categoria")
    .populate("Usuario");
};

export const pesUsuarioService = (id) => {
  console.log("Pesquisando transações por Usuário ID:", id);
  return Transacao.find({ Usuario: id })
    .sort({ _id: -1 })
    .populate("categoria")
    .populate("Usuario");
};

export const atualizarTransService = (id, atualizacao) => {
  console.log("Atualizando transação com ID:", id, "e dados:", atualizacao);
  return Transacao.findOneAndUpdate(
    { _id: id },
    { ...atualizacao },
    { rawResult: true }
  );
};

export const deletarTransService = (id) => {
  console.log("Deletando transação com ID:", id);
  return Transacao.findOneAndDelete({ _id: id });
};