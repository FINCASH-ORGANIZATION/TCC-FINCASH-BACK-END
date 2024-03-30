import { criartranService, pestraService, contarTrans } from "../services/transacao.service.js";
import mongoose from "mongoose";

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
    let { limit, offset } = req.query

    limit = Number(limit);
    offset = Number(offset);

    if (limit) {
        limit = 5
    }

    if (offset) {
        offset = 0
    }

    const transacao = await pestraService(limit, offset).select("+senha");
    const total = await contarTrans;
    const currentURL = req.baseUrl;
    console.log(currentURL)

    const avancar = offset + limit;
    const avancarURL = avancar < total ? `${currentURL}?limit=${limit}&offset=${offset}` : null;

    if (transacao.length === 0) {
        res.status(400).send({
            mensagem: "Não há transações registradas!"
        })
    };

    if (transacao.Usuario === null) {
        return transacao.Usuario = 'Usuario deletado';
    };

    res.send(transacao);
};

export {
    criarTransacao,
    pesTransacao
};