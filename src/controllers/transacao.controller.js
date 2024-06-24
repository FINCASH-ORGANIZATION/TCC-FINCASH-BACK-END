export const criarTransacaoRota = async (req, res) => {
  try {
    const {
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
    } = req.body;

    if (!valor || !data || !tipoTransacao || !categoria || !conta) {
      return res
        .status(400)
        .send({ mensagem: "Por favor, preencha todos os campos!" });
    }

    const novaTransacao = await criartranService({
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
      Usuario: req.UsuarioId,
    });

    // Chame a função atualizarSaldo para atualizar o saldo do usuário
    await atualizarSaldo(req.UsuarioId);

    res.status(200).send({
      mensagem: "Uma nova transação foi feita!",
      transacao: novaTransacao,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const pesTransacaoRota = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit) || 15;
    offset = Number(offset) || 0;

    const transacao = await pestraService(limit, offset);
    const total = await contarTranService();
    const currentURL = req.baseUrl;

    if (transacao.length === 0) {
      return res
        .status(400)
        .send({ mensagem: "Não há transações registradas!" });
    }

    const avancar = offset + limit;
    const avancarURL =
      avancar < total
        ? `${currentURL}?limit=${limit}&offset=${avancar}`
        : "Sem registros!";
    const anterior = offset - limit < 0 ? null : offset - limit;
    const antigaURL =
      anterior != null
        ? `${currentURL}?limit=${limit}&offset=${anterior}`
        : "Sem registros!";

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
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const pesquisaIDRota = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await pesIDService(id);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
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
        usuario: transacao.Usuario
          ? transacao.Usuario
          : "Usuário não encontrado!",
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const pesDescricaoRota = async (req, res) => {
  try {
    const { descricao } = req.query;

    const transacao = await pesqDescricaoService(descricao);

    if (transacao.length === 0) {
      return res
        .status(400)
        .send({ mensagem: "Transação não localizada no servidor!" });
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
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const pesDescricaoRotaId = async (req, res) => {
  try {
    const { descricao } = req.query;

    const transacao = await pesqDescricaoService(descricao, req.UsuarioId);

    if (transacao.length === 0) {
      return res
        .status(400)
        .send({ mensagem: "Transação não localizada no servidor!" });
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
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

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
        usuario: item.Usuario ? item.Usuario : "Usuário não encontrado!",
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const atualizarTrans = async (req, res) => {
  try {
    const {
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
      categoriaPersonalizada,
    } = req.body;
    const { id } = req.params;

    const tiposValidos = ["Despesa", "Receita"];
    if (!tiposValidos.includes(tipoTransacao)) {
      return res.status(400).send({ mensagem: "Tipo de transação inválido!" });
    }

    const transacao = await pesIDService(id);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    const camposAlterados = Object.keys(req.body).filter(
      (key) => req.body[key] !== transacao[key]
    );

    if (camposAlterados.length === 0) {
      return res.status(400).send({ mensagem: "Faça ao menos uma alteração!" });
    }

    await atualizarTransService(
      id,
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      notas,
      categoriaPersonalizada
    );

    const saldo = await calcularSaldo(req.UsuarioId);
    await Usuario.findByIdAndUpdate(req.UsuarioId, { saldo });

    res.status(200).send({ mensagem: "Transação atualizada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deletarTrans = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!objectId) {
      return res.status(400).send({ mensagem: "ID de transação inválido" });
    }

    const transacao = await pesIDService(objectId);
    if (!transacao) {
      return res.status(404).send({ mensagem: "Transação não encontrada" });
    }

    if (transacao.Usuario._id.toString() != req.UsuarioId) {
      return res.status(403).send({
        mensagem: "Você não tem permissão para deletar essa transação",
      });
    }

    await deletarTransService(objectId);

    res.status(200).send({ mensagem: "Transação deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
