import { populate } from "dotenv";
import transacao from "../models/transacao.js";
import UsuarioSchema from "../models/Usuario.js"

const criartranService = (body) => transacao.create(body);

const pestraService = (limit, offset) => transacao.find().sort({ _id: -1 }).skip(offset).limit(limit).populate('Usuario');

const contarTranService = () => transacao.countDocuments();

const pesIDService = (id) => transacao.findById(id).populate('Usuario');

const pesqDescricaoService = (descricao) => transacao.find({
    descricao: { $regex: `${descricao || ""}`, $options: "i" }
})
    .sort({ _id: -1 })
    .populate('Usuario');

export {
    criartranService,
    pestraService,
    contarTranService,
    pesIDService,
    pesqDescricaoService
};