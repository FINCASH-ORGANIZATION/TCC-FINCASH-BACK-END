import conta from "../models/conta.js";

export const criarDespesaService = (body) => contacreate(body);

// Função para buscar todas as conta
export const pesDespesaService = () => despesa.find().populate('Usuario');;

// Função para buscar uma despesa pelo seu Id
export const pesDespesaIdService = (id) => despesa.findById(id).populate('Usuario');

// Função para buscar uma despesa pela sua descrição
export const despesaDescricaoService = (descricao) =>
    despesa.find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate('categoria')
        .populate('Usuario');

// Função para atualizar uma despesa por ID
export const atualizarDespesaService = (id, descricao, valor, data, categoria, conta) =>
    despesa.findByIdAndUpdate(
        id,
        { descricao, valor, data, categoria, conta },
        { new: true, rawResult: true }
    );

// Função para deletar uma despesa por ID
export const deletarDespesaService = (id) => despesa.findByIdAndDelete({ _id: id });