import Despesa from "../models/despesa.js";
import transacao from '../models/transacao.js';

export const criarDespesaService = async (despesaData, options) => {
  const novaDespesa = new transacao(despesaData);
  return await novaDespesa.save(options);
};

// servicos/despesaService.js
export const pesDespesaService = async (usuarioId) => {
    try {
      // Implementação da função pesDespesaService
      // Exemplo: buscar despesas do usuário com base no ID
      return await Despesa.find({ Usuario: usuarioId }).populate('Usuario').exec();
    } catch (error) {
      throw new Error('Erro ao buscar despesas do usuário: ' + error.message);
    }
  };
  

// Função para buscar uma despesa pelo seu Id
export const pesDespesaIdService = (id) => Despesa.findById(id).populate('Usuario');

// Função para buscar uma despesa pela sua descrição
export const despesaDescricaoService = (descricao) =>
    Despesa.find({
        descricao: { $regex: `${descricao || ""}`, $options: "i" }
    })
        .sort({ _id: -1 })
        .populate('Usuario');

// Função para atualizar uma despesa por ID
export const atualizarDespesaService = (id, descricao, valor, data, categoria, conta) =>
    Despesa.findByIdAndUpdate(
        id,
        { descricao, valor, data, categoria, conta },
        { new: true, rawResult: true }
    );

// Função para deletar uma despesa por ID
export const deletarDespesaService = (id) => Despesa.findByIdAndDelete({ _id: id });