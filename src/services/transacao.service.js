import transacao from "../models/transacao.js";

const criartransService = (body) => transacao.create(body);

const pesTransService = () => transacao.find()

export {
    criartransService,
    pesTransService
};