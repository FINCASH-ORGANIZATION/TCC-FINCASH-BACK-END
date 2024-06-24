import Receita from "../models/receita.js";


export const pesReceitasPorUsuarioIdService = async (usuarioId) => {
  try {
    const receitas = await Receita.find({ Usuario: usuarioId }).populate('Usuario').exec();
    return receitas;
  } catch (error) {
    throw new Error('Erro ao buscar receitas por usuário: ' + error.message);
  }
};


export const criarReceitaService = (body) => Receita.create(body);

// Função para buscar todas as Receitas
export const pesReceitaService = () => Receita.find().populate('Usuario');;

// Função para buscar uma Receita pelo seu Id
export const pesReceitaIdService = (id) => Receita.findById(id).populate('Usuario');

// Função para buscar uma Receita pela sua descrição
export const receitaDescricaoService = (descricao) =>
    Receita.find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate('Usuario');

// Função para atualizar uma Receita por ID
export const atualizarReceitaService = (id, descricao, valor, data, categoria, conta) =>
    Receita.findByIdAndUpdate(
        id,
        { descricao, valor, data, categoria, conta },
        { new: true, rawResult: true }
    );

// Função para deletar um Receita por ID
export const deletarReceitaService = (id) => Receita.findByIdAndDelete({ _id: id });