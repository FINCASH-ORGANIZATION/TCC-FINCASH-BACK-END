import {
  criarCartaoService,
  pesCartaoService,
  pesCartaoIdService,
  atualizarCartaoService,
  deletarCartaoService,
} from "../services/cartoes.service.js";

// Rota para criar um novo cartão de crédito
export const criarCartao = async (req, res) => {
  try {
    const { valor, limite, descricao, fechamento, vencimento, conta } =
      req.body;

    if (!valor || !limite || !fechamento || !vencimento || !conta) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos!" });
    }

    const novoCartao = await criarCartaoService({
      valor,
      limite,
      descricao,
      fechamento,
      vencimento,
      conta,
      Usuario: req.UsuarioId,
    });

    res.status(201).send({
      mensagem: "Cartão de crédito adicionado com sucesso!",
      cartao: novoCartao,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função que retorna todos os cartões de crédito cadastrados no banco de dados de todos os usuários
export const pesCartaoRota = async (req, res) => {
  try {
    const cartoes = await pesCartaoService();

    if (cartoes.length === 0) {
      return res
        .status(400)
        .send({ mensagem: "Não há cartões de crédito registrados!" });
    }

    res.send({
      results: cartoes.map((item) => ({
        id: item._id,
        valor: item.valor,
        limite: item.limite,
        descricao: item.descricao,
        fechamento: item.fechamento,
        vencimento: item.vencimento,
        conta: item.conta,
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Função que permite pesquisar o cartão pelo seu Id
export const pesCartaoIdRota = async (req, res) => {
  try {
    const { id } = req.params;

    const cartao = await pesCartaoIdService(id);

    if (!cartao) {
      return res.status(404).send({ mensagem: "Cartão não encontrado!" });
    }

    res.send({
      id: cartao._id,
      valor: cartao.valor,
      limite: cartao.limite,
      descricao: cartao.descricao,
      fechamento: cartao.fechamento,
      vencimento: cartao.vencimento,
      conta: cartao.conta,
      usuario: cartao.Usuario ? cartao.Usuario : "Usuário não encontrado!",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Rota para editar um cartão de crédito
export const atualizarCartao = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, limite, descricao, fechamento, vencimento, conta } =
      req.body;

    // Verifique se pelo menos um dos campos está sendo atualizado
    if (
      !valor &&
      !limite &&
      !descricao &&
      !fechamento &&
      !vencimento &&
      !conta
    ) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    // Crie um objeto com os campos a serem atualizados
    const camposAtualizados = {};
    if (valor) camposAtualizados.valor = valor;
    if (limite) camposAtualizados.limite = limite;
    if (descricao) camposAtualizados.descricao = descricao;
    if (fechamento) camposAtualizados.fechamento = fechamento;
    if (vencimento) camposAtualizados.vencimento = vencimento;
    if (conta) camposAtualizados.conta = conta;

    // Chame o serviço para atualizar o cartão
    const cartaoAtualizado = await atualizarCartaoService(
      id,
      camposAtualizados
    );

    // Verifique se o cartão foi encontrado e atualizado
    if (!cartaoAtualizado) {
      return res.status(404).send({ mensagem: "Cartão não encontrado" });
    }

    res.status(200).json(cartaoAtualizado);
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
      return res.status(404).json({ message: "Cartão não encontrado" });
    }

    res.status(200).json({ message: "Cartão deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
