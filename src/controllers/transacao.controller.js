import { query } from "express";
import {
    criartranService,
    pestraService,
    contarTranService,
    pesIDService,
    pesqDescricaoService,
    pesUsuarioService
} from "../services/transacao.service.js";
import transacao from "../models/transacao.js";

const criarTransacaoRota = async (req, res) => {
    try {
        const { descricao, precoUnitario, valorTotal } = req.body;

        if (!descricao || !precoUnitario || !valorTotal) {
            res.status(400).send({ mensagem: "Por favor, preencha todos os campos para se registrar!" });
        }

        await criartranService({
            descricao,
            precoUnitario,
            valorTotal,
            Usuario: req.UsuarioId,
        });

        res.status(200).send({ mensagem: "Uma Nova transação foi efetuada!" })
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    };
};

const pesTransacaoRota = async (req, res) => {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
        limit = 5;
    }

    if (!offset) {
        offset = 0;
    }

    // Chama a função pestraService para obter transações com limite (limit) e deslocamento (offset).
    const transacao = await pestraService(limit, offset);
    // Obtém o total de transações.
    const total = await contarTranService();
    // Obtém a URL base atual da requisição.
    const currentURL = req.baseUrl;

    // Calcula o próximo deslocamento (avançar) adicionando o limite (limit) ao deslocamento atual (offset).
    const avancar = offset + limit;

    /* Verifica se o avanço não ultrapassa o total de transações; 
    Se não ultrapassar, cria a URL de avanço com os parâmetros limit e offset;
    Caso contrário, define a mensagem "Sem registros!" indicando que o offset está nos Sem registros.*/
    const avancarURL = avancar < total ? `${currentURL}?limit=${limit}&offset=${avancar}` : "Sem registros!";

    // Calcula o deslocamento anterior (anterior) subtraindo o limite (limit) do deslocamento atual (offset).
    const anterior = offset - limit < 0 ? null : offset - limit;

    // Verifica se o deslocamento anterior é maior ou igual a zero;
    // Se for, cria a URL de visualização com os parâmetros limit e offset;
    // Caso contrário, define a mensagem "Sem registros!" indicando que o offset está nos Sem registros.
    const antigaURL = anterior != null ? `${currentURL}?limit=${limit}?offset=${anterior}` : "Sem registros!";

    if (transacao.length === 0) {
        res.status(400).send({
            mensagem: "Não há transações registradas!"
        })
    };

    /* Traz a requisição dos itens acima e faz um res(resposta) direto na tela. Já o map ele cria um array que retorna 
    Os dados tanto das transações quanto dados do próprio usuário. */
    res.send({
        avancarURL,
        antigaURL,
        limit,
        offset,
        total,

        results: transacao.map((item) => ({
            id: item._id,
            descricao: item.descricao,
            precoUnitario: item.precoUnitario,
            valorTotal: item.valorTotal,
            data: item.data,
            usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
        })),
    });
};

const pesquisaIDRota = async (req, res) => {
    try {
        const { id } = req.params;

        const transacao = await pesIDService(id);

        res.send({
            transacao: {
                id: transacao._id,
                descricao: transacao.descricao,
                precoUnitario: transacao.precoUnitario,
                valorTotal: transacao.valorTotal,
                data: transacao.data,
                usuario: transacao.Usuario ? transacao.Usuario : "Usuário não encontrado!"
            },
        });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    };
};

const pesDescricaoRota = async (req, res) => {
    try {
        const { descricao } = req.query;

        const transacao = await pesqDescricaoService(descricao);

        if (transacao.length === 0) {
            return res.status(400).send({ mensagem: "Transação não localizada no servidor!" })
        };

        return res.send({
            results: transacao.map((item) => ({
                id: item._id,
                descricao: item.descricao,
                precoUnitario: item.precoUnitario,
                valorTotal: item.valorTotal,
                data: item.data,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    }
    catch (error) {
        res.status(404).send({ message: error.message });
    };
};

const pesUsuarioRota = async (req, res) => {
    try {
        const id = req.UsuarioId;
        console.log('Valor de req.UsuarioId:', id);

        const transacao = await pesUsuarioService(id);

        return res.send({
            results: transacao.map((item) => ({
                id: item._id,
                descricao: item.descricao,
                precoUnitario: item.precoUnitario,
                valorTotal: item.valorTotal,
                data: item.data,
                usuario: item.Usuario
            })),
        });
    } catch (error) {
        console.log('Erro ao buscar transações:', error);
        res.status(500).send({ message: error.message });
    }
};

export {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesDescricaoRota,
    pesUsuarioRota
};