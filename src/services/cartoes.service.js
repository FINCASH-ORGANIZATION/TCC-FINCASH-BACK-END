import cartao from "../models/cartao.js";

export const criarCartaoService = (body) => cartao.create(body);

// Função para buscar todos os cartões
export const pesCartaoService = () => cartao.find().populate('Usuario');;

// Função para buscar um cartão por ID
export const pesCartaoIdService = (id) => cartao.findById(id).populate('Usuario');

// Função para atualizar um cartão por ID
export const atualizarCartaoService = (id, body) =>
    cartao.findByIdAndUpdate(
        { _id: id },
        { ...body },
        { new: true, rawResult: true }
    );

// Função para deletar um cartão por ID
export const deletarCartaoService = (id) => cartao.findByIdAndDelete({ _id: id });