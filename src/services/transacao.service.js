import transacao from "../models/transacao.js";

const criartranService = (body) => transacao.create(body);

const pestraService = () => transacao.find()

export {
    criartranService,
    pestraService
};