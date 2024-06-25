import Conta from "../models/conta.js";

export const criarContaService = async (data) => {
    const novaConta = new Conta(data);
    return await novaConta.save();
};

// Função para buscar todas as Conta do próprio usuário
export const pesContaService = () => Conta.find().populate('Usuario');;

// Função para buscar uma Conta pelo seu Id
export const pesContaIdService = (id) => Conta.findById(id).populate('Usuario');

// Função para deletar uma Conta
export const deletarContaService = (id) => Conta.findByIdAndDelete({ _id: id });

