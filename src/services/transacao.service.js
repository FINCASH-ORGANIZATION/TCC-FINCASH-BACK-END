import transacao from "../models/transacao.js";

export const criartranService = (body) => transacao.create(body);

export const pestraService = (limit, offset) => transacao.find().sort({ _id: -1 }).skip(offset).limit(limit).populate('Usuario');

export const contarTranService = () => transacao.countDocuments();

export const pesIDService = (id) => transacao.findById(id).populate('Usuario');

export const pesqDescricaoService = (descricao) => transacao.find({
    descricao: { $regex: `${descricao || ""}`, $options: "i" }
})
    .sort({ _id: -1 })
    .populate('Usuario');

export const pesUsuarioService = (id) => transacao.find({ Usuario: id }).sort({ _id: -1 })
    .populate('Usuario');

export const atualizarTransService = (id, descricao, precoUnitario, valorTotal) => transacao.findOneAndUpdate({ _id: id }, { descricao, precoUnitario, valorTotal }, { rawResult: true });

export const deletarTransService = (id) => transacao.findOneAndDelete({ _id: id });