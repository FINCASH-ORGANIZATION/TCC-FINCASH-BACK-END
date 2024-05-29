import transacao from "../models/transacao.js";

const criartranService = (body) => transacao.create(body);

const pestraService = (limit, offset) => transacao.find().sort({ _id: -1 }).skip(offset).limit(limit).populate('Usuario');

const contarTranService = () => transacao.countDocuments();

const pesIDService = (id) => transacao.findById(id).populate('Usuario');

const pesqDescricaoService = (descricao) => transacao.find({
    descricao: { $regex: `${descricao || ""}`, $options: "i" }
})
    .sort({ _id: -1 })
    .populate('Usuario');

const pesUsuarioService = (id) => transacao.find({ Usuario: id }).sort({ _id: -1 })
    .populate('Usuario');

const deletarTransService = (id) => transacao.findByIdAndDelete({ _id: id });

export {
    criartranService,
    pestraService,
    contarTranService,
    pesIDService,
    pesqDescricaoService,
    pesUsuarioService,
    deletarTransService
};