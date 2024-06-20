import categoriaTransacao from "../models/categoriaTransacao.js";
import {
    criartranService,
    pestraService,
    contarTranService,
    pesIDService,
    pesqDescricaoService,
    pesUsuarioService,
    atualizarTransService,
    deletarTransService
} from "../services/transacao.service.js";
import { calcularSaldo } from "./saldo.controller.js";
import Usuario from '../models/Usuario.js';
import mongoose from "mongoose";

/* Função criar transação */
export const criarTransacaoRota = async (req, res) => {
    try {
        const { valor, data, descricao, tipoTransacao, categoria, formaPagamento, conta, notas, categoriaPersonalizada } = req.body;

        if (!valor || !data || !tipoTransacao || !categoria || !conta) {
            return res.status(400).send({ mensagem: "Por favor, preencha todos os campos!" });
        }

        let categoriaObj;

        if (categoria === 'Outros' && categoriaPersonalizada) {
            categoriaObj = new categoriaTransacao({
                tipo: categoria,
                categoriaPersonalizada,
                Usuario: req.UsuarioId
            });

            await categoriaObj.save();
        } else {
            categoriaObj = await categoriaTransacao.findOne({ tipo: categoria });

            if (!categoriaObj) {
                return res.status(400).send({ mensagem: "Categoria inválida!" });
            }
        }

        const novaTransacao = await criartranService({
            valor,
            data,
            descricao,
            tipoTransacao,
            categoria: categoriaObj._id,
            categoriaPersonalizada,
            formaPagamento,
            conta,
            notas,
            Usuario: req.UsuarioId,
        });

        const saldo = await calcularSaldo(req.UsuarioId);
        await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

        res.status(200).send({ mensagem: "Uma Nova transação foi feita!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* Função que retorna todas as transações cadastradas no banco de dados de todos os usuários */
export const pesTransacaoRota = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit) || 15;
        offset = Number(offset) || 0;

        const transacao = await pestraService(limit, offset);
        const total = await contarTranService();
        const currentURL = req.baseUrl;

        const avancar = offset + limit;
        const avancarURL = avancar < total ? `${currentURL}?limit=${limit}&offset=${avancar}` : "Sem registros!";

        const anterior = offset - limit < 0 ? null : offset - limit;
        const antigaURL = anterior != null ? `${currentURL}?limit=${limit}&offset=${anterior}` : "Sem registros!";

        if (transacao.length === 0) {
            return res.status(400).send({ mensagem: "Não há transações registradas!" });
        }

        res.send({
            avancarURL,
            antigaURL,
            limit,
            offset,
            total,
            results: transacao.map((item) => ({
                id: item._id,
                valor: item.valor,
                data: item.data,
                descricao: item.descricao,
                tipoTransacao: item.tipoTransacao,
                categoria: item.categoria,
                formaPagamento: item.formaPagamento,
                conta: item.conta,
                notas: item.notas,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* Função para pesquisar a transação pelo id */
export const pesquisaIDRota = async (req, res) => {
    try {
        const { id } = req.params;

        const transacao = await pesIDService(id);
        if (!transacao) {
            return res.status(404).send({ mensagem: 'Transação não encontrada' });
        }

        res.send({
            transacao: {
                id: transacao._id,
                valor: transacao.valor,
                data: transacao.data,
                descricao: transacao.descricao,
                tipoTransacao: transacao.tipoTransacao,
                categoria: transacao.categoria,
                formaPagamento: transacao.formaPagamento,
                conta: transacao.conta,
                notas: transacao.notas,
                usuario: transacao.Usuario ? transacao.Usuario : "Usuário não encontrado!"
            },
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* Função que permite pesquisar a transação de acordo com a descrição que o usuário deu a ela */
export const pesDescricaoRota = async (req, res) => {
    try {
        const { descricao } = req.query;

        const transacao = await pesqDescricaoService(descricao);

        if (transacao.length === 0) {
            return res.status(400).send({ mensagem: "Transação não localizada no servidor!" });
        }

        res.send({
            results: transacao.map((item) => ({
                id: item._id,
                valor: item.valor,
                data: item.data,
                descricao: item.descricao,
                tipoTransacao: item.tipoTransacao,
                categoria: item.categoria,
                formaPagamento: item.formaPagamento,
                conta: item.conta,
                notas: item.notas,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* Função que retorna para o usuário todas as transações que estão na sua conta */
export const pesUsuarioRota = async (req, res) => {
    try {
        const id = req.UsuarioId;

        const transacao = await pesUsuarioService(id);

        res.send({
            results: transacao.map((item) => ({
                id: item._id,
                valor: item.valor,
                data: item.data,
                descricao: item.descricao,
                tipoTransacao: item.tipoTransacao,
                categoria: item.categoria,
                formaPagamento: item.formaPagamento,
                conta: item.conta,
                notas: item.notas,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* Função para o usuário atualizar os dados de dentro da transação que ele estiver manipulando */
export const atualizarTrans = async (req, res) => {
    try {
        const { valor, data, descricao, tipoTransacao, categoria, formaPagamento, conta, notas, categoriaPersonalizada } = req.body;
        const { id } = req.params;

        const tiposValidos = ['Despesa', 'Receita'];
        if (!tiposValidos.includes(tipoTransacao)) {
            return res.status(400).send({ mensagem: 'Tipo de transação inválido!' });
        }

        const transacao = await pesIDService(id);
        if (!transacao) {
            return res.status(404).send({ mensagem: 'Transação não encontrada' });
        }

        /* if (transacao.Usuario._id.toString() !== req.UsuarioId) {
            return res.status(403).send({ mensagem: 'Você não tem permissão para atualizar essa transação' });
        } */

        const camposAlterados = Object.keys(req.body).filter(key => req.body[key] !== transacao[key]);

        if (camposAlterados.length === 0) {
            return res.status(400).send({ mensagem: 'Faça ao menos uma alteração!' });
        }

        await atualizarTransService(id, valor, data, descricao, tipoTransacao, categoria, formaPagamento, conta, notas, categoriaPersonalizada);

        const saldo = await calcularSaldo(req.UsuarioId);
        await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

        res.status(200).send({ mensagem: 'Transação atualizada com sucesso!' });
    } catch (error) {
        res.status(500).send({ mensagem: error.message });
    }
};

/* Função para deletar as transação */
export const deletarTrans = async (req, res) => {
    try {
        const { id } = req.params;

        const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
        if (!objectId) {
            return res.status(400).send({ mensagem: 'ID de transação inválido' });
        }

        const transacao = await pesIDService(objectId);
        if (!transacao) {
            return res.status(404).send({ mensagem: 'Transação não encontrada' });
        }

        if (transacao.Usuario._id.toString() != req.UsuarioId) {
            return res.status(403).send({ mensagem: 'Você não tem permissão para deletar essa transação' });
        }

        await deletarTransService(objectId);

        res.status(200).send({ mensagem: "Transação deletada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};