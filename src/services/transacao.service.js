import { populate } from "dotenv";
import transacao from "../models/transacao.js";
import UsuarioSchema from "../models/Usuario.js"

const criartranService = (body) => transacao.create(body);

const pestraService = (limit, offset) => transacao.find().sort({ _id: -1 }).skip(offset).limit(limit).populate('Usuario');

const contarTrans = () => transacao.countDocuments();

export {
    criartranService,
    contarTrans,
    pestraService
};