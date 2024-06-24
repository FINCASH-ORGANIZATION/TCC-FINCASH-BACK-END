import Receita from "../models/receita.js";

export const criarReceitaService = (body) => Receita.create(body);

// Função para buscar todas as Receitas
export const pesReceitaService = () => Receita.find().populate("Usuario");

// Função para deletar um Receita por ID
export const deletarReceitaService = (id) =>
  Receita.findByIdAndDelete({ _id: id });
