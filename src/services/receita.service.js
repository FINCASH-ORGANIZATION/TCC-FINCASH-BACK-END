import receita from "../models/receita.js";

export const criarReceitaService = (body) => receita.create(body);

// Função para buscar todas as receitas
export const pesReceitaService = () => receita.find().populate('Usuario');;

// Função para buscar uma receita pelo seu Id
export const pesReceitaIdService = (id) => receita.findById(id).populate('Usuario');

// Função para buscar uma receita pela sua descrição
export const receitaDescricaoService = (descricao) =>
    transacao.find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate('categoria')
        .populate('Usuario');

// Função para atualizar uma receita por ID
export const atualizarReceitaService = (id, body) =>
    receita.findByIdAndUpdate(
        { _id: id },
        { ...body },
        { new: true, rawResult: true }
    );

// Função para deletar um receita por ID
export const deletarReceitaService = (id) => receita.findByIdAndDelete({ _id: id });