import { criartranService, pestraService } from "../services/transacao.service.js";

const criarTransacao = async (req, res) => {
    try {
        const { tipo, precoUnitario, valorTotal } = req.body;

        if (!tipo || !precoUnitario || !valorTotal) {
            res.status(400).send({ mensagem: "Por favor, preencha todos os campos para se registrar!" });
        }

        await criartranService({
            tipo,
            precoUnitario,
            valorTotal,
            Usuario: req.UsuarioId,
        });

        res.send(201)
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    };
};

const pesTransacao = async (req, res) => {
    const transacao = await pestraService();
    if (transacao.length === 0)
        return res.status(400).send({
            mensagem: "Não há transações registradas!"
        })
    res.send(transacao);
};

export {
    criarTransacao,
    pesTransacao
};