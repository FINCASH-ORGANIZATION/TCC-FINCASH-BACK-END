import conta from "../models/conta.js";

export const criarContaService = (body) => conta.create(body);

// Função para buscar todas as conta do próprio usuário
export const pesContaService = () => conta.find().populate('Usuario');;

// Função para buscar uma conta pelo seu Id
export const pesContaIdService = (id) => conta.findById(id).populate('Usuario');

// Função para atualizar uma conta
export const atualizarContaService = (id, valor, descricao, ) =>
    conta.findByIdAndUpdate(
        id,
        { valor, descricao,  },
        { new: true, rawResult: true }
    );

// Função para deletar uma conta
export const deletarContaService = (id) => conta.findByIdAndDelete({ _id: id });