import {
    criarCartaoService,
    pesCartaoService,
    /* pesCartaoIdService, */
    atualizarCartaoService,
    deletarCartaoService,
} from "../services/cartoes.service.js";

// Rota para criar um novo cartão de crédito
export const criarCartao = async (req, res) => {
    try {
        const { nomeCartao, limite, descricao, fechamento, vencimento, conta, usuarioId } = req.body;

        if (!nomeCartao || !limite || !fechamento || !vencimento || !conta || !usuarioId) {
            return res.status(400).send({ mensagem: "Por favor, preencha todos os campos!" });
        }

        const novoCartao = await criarCartaoService({ nomeCartao, limite, descricao, fechamento, vencimento, conta, usuarioId });

        res.status(201).send({ mensagem: "Cartão de crédito adicionado com sucesso!", cartao: novoCartao });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Função que retorna todos os cartões de crédito cadastrados no banco de dados de todos os usuários
export const pesCartaoRota = async (req, res) => {
    try {
        const cartoes = await pesCartaoService().populate('usuarioId', 'nome email');

        if (cartoes.length === 0) {
            return res.status(400).send({ mensagem: "Não há cartões de crédito registrados!" });
        }

        res.send({
            results: cartoes.map((item) => ({
                id: item._id,
                nomeCartao: item.nomeCartao,
                limite: item.limite,
                descricao: item.descricao,
                fechamento: item.fechamento,
                vencimento: item.vencimento,
                conta: item.conta,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/* // Função que permite pesquisar a transação de acordo com a descrição que o usuário deu a ela
export const pesCartaoIdRota = async (req, res) => {
    try {
        const id = req.UsuarioId;

        const cartao = await pesCartaoIdService(id);

        res.send({
            results: cartao.map((item) => ({
                id: item._id,
                nomeCartao: item.nomeCartao,
                limite: item.limite,
                descricao: item.descricao,
                fechamento: item.fechamento,
                vencimento: item.vencimento,
                conta: item.conta,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!"
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}; */

// Rota para editar um cartão de crédito
export const atualizarCartao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomeCartao, limite, descricao, fechamento, vencimento, conta, usuarioId } = req.body;

        const cartaoAtualizado = await atualizarCartaoService(id, { nomeCartao, limite, descricao, fechamento, vencimento, conta, usuarioId });

        if (!cartaoAtualizado.value) {
            return res.status(404).json({ message: 'Cartão não encontrado' });
        }

        const camposAlterados = Object.keys(req.body).filter(key => req.body[key] !== cartaoAtualizado.value[key]);

        if (camposAlterados.length === 0) {
            return res.status(400).send({ mensagem: 'Faça ao menos uma alteração!' });
        }

        res.status(200).json(cartaoAtualizado.value);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Rota para deletar um cartão de crédito
export const deletarCartao = async (req, res) => {
    try {
        const { id } = req.params;

        const cartaoDeletado = await deletarCartaoService(id);

        if (!cartaoDeletado) {
            return res.status(404).json({ message: 'Cartão não encontrado' });
        }

        res.status(200).json({ message: 'Cartão deletado com sucesso' });
    } catch (error) {
        res.status (500).json({ error: error.message });
    }
};
