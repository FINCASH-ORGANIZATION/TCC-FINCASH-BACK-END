import despesa from "../models/despesa.js";

export const criarDespesaService = (body) => despesa.create(body);

// Função para buscar todas as despesas
export const pesDespesaService = () => despesa.find().populate('Usuario');;

// Função para buscar uma despesa pelo seu Id
export const pesDespesaIdService = (id) => despesa.findById(id).populate('Usuario');

// Função para buscar uma despesa pela sua descrição
export const despesaDescricaoService = (descricao) =>
    transacao.find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate('categoria')
        .populate('Usuario');

// Função para atualizar uma despesa por ID
export const atualizarDespesaService = (id, body) =>
    despesa.findByIdAndUpdate(
        { _id: id },
        { ...body },
        { new: true, rawResult: true }
    );

// Função para deletar um despesa por ID
export const deletarDespesaService = (id) => despesa.findByIdAndDelete({ _id: id });