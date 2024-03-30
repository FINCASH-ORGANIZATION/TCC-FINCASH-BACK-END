import transacao from "../models/transacao.js";

const criartranService = (body) => transacao.create(body);

const pestraService = (limit, offset) => transacao.find().sort({_id: -1}).skip(offset).limit(limit).populate("Usuario");

export {
    criartranService,
    pestraService
};