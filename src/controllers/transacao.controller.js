import { criartransService, pesTransService } from "../services/transacao.service.js";
import { ObjectId } from "mongoose";

const criarTransacao = async (req, res) => {
    try {
        const { tipo, precoUnitario, valorTotal} = req.body;

        if (!tipo || !precoUnitario || !valorTotal) {
            res.status(400).json({ message: "Por favor, preencha todos os campos para se registrar!" })
        };

        await criartransService({
            tipo,
            precoUnitario,
            valorTotal,
            Usuario: {_id: "65ee28960a3e7912cbdb013f"},
        });

        res.status(201)
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    };
};

const pesTransacao = (req, res) => {
    const transacao = [];
    res.send(transacao);
};

export {
    pesTransacao,
    criarTransacao
};