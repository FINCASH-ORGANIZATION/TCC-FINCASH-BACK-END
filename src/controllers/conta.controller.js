import {
    criarContaService,
    pesContaService,
    pesContaIdService,
    atualizarContaService,
    deletarContaService,
} from "../services/conta.service.js";

// Rota para criar um novo conta
export const criarConta = async (req, res) => {
    try {
        const { valor, descricao, /* banco */ } = req.body;

        if (!valor /* || !banco */) {
            return res.status(400).send({ mensagem: "Por favor, preencha todos os campos!" });
        }

        const novaConta = await criarContaService({
            valor,
            descricao,
            /* banco, */
            Usuario: req.UsuarioId,
        });

        res.status(201).send({ mensagem: "Conta adicionada com sucesso!", conta: novaConta });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obter todas as contas
export const pesContaRota = async (req, res) => {
    try {
        const id = req.UsuarioId;

        const conta = await pesContaService(id);

        res.send({
            results: conta.map((item) => ({
                id: item._id,
                valor: item.valor,
                descricao: item.descricao,
                banco: item.banco,
                usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
            })),
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Obter uma conta por ID
export const pesContaIdRota = async (req, res) => {
    try {
        const { id } = req.params;

        const conta = await pesContaIdService(id);

        if (!conta) {
            return res.status(404).send({ mensagem: "Conta não encontrada!" });
        }

        res.send({
            id: conta._id,
            valor: conta.valor,
            descricao: conta.descricao,
            banco: conta.banco,
            usuario: conta.Usuario ? conta.Usuario : "Usuário não encontrado!"
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Atualizar uma conta
export const atualizarConta = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor, descricao, banco } = req.body;

        // Verifique se pelo menos um dos campos está sendo atualizado
        if (!valor && !descricao && !banco) {
            return res.status(400).send({ mensagem: 'Faça ao menos uma alteração!' });
        }

        // Crie um objeto com os campos a serem atualizados
        const camposAtualizados = {};
        if (valor) camposAtualizados.valor = valor;
        if (descricao) camposAtualizados.descricao = descricao;
        if (banco) camposAtualizados.banco = banco;

        // Chame o serviço para atualizar a conta
        const contaAtualizado = await atualizarContaService(id, camposAtualizados);

        // Verifique se a conta foi encontrada e atualizada
        if (!contaAtualizado) {
            return res.status(404).send({ mensagem: 'Conta não encontrada' });
        }

        res.status(200).send(contaAtualizado);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Deletar uma conta
export const deletarConta = async (req, res) => {
    try {
        const { id } = req.params;

        const contaDeletada = await deletarContaService(id);

        if (!contaDeletada) {
            return res.status(404).send({ message: 'Conta não encontrada' });
        }

        res.status(200).send({ message: 'Conta deletada com sucesso!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};