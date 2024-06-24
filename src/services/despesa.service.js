import Despesa from "../models/despesa.js";

export const criarDespesaService = (body) => Despesa.create(body);

// Função para buscar todas as Despesas
export const pesDespesaService = () => Despesa.find().populate("Usuario");

// Função para deletar um Despesa por ID
export const deletarDespesaService = (id) =>
  Despesa.findByIdAndDelete({ _id: id });