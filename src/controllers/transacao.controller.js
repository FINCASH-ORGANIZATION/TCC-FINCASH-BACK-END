import { criartranService, pestraService, contarTrans } from "../services/transacao.service.js";

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
    const total = await contarTrans();
    // Obtém a URL base atual da requisição.
    const currentURL = req.baseUrl;

    // Calcula o próximo deslocamento (avançar) adicionando o limite (limit) ao deslocamento atual (offset).
    const avancar = offset + limit;

    // Verifica se o avanço não ultrapassa o total de transações;
    // Se não ultrapassar, cria a URL de avanço com os parâmetros limit e offset;
    // Caso contrário, define a mensagem "Últimos registros!" indicando que o offset está nos últimos registros.
    const avancarURL = avancar < total ? `${currentURL}?limit=${limit}&offset=${avancar}` : "Últimos registros!";

    // Calcula o deslocamento anterior (preview) subtraindo o limite (limit) do deslocamento atual (offset).
    const preview = offset - limit < 0 ? null : offset - limit;

    // Verifica se o deslocamento anterior é maior ou igual a zero;
    // Se for, cria a URL de visualização com os parâmetros limit e offset;
    // Caso contrário, define a mensagem "Últimos registros!" indicando que o offset está nos últimos registros.
    const previewURL = preview != null ? `${currentURL}?limit=${limit}?offset=${preview}` : "Últimos registros!";

    if (transacao.length === 0) {
        res.status(400).send({
            mensagem: "Não há transações registradas!"
        })
    };

    /* Traz a requisição dos itens acima e faz um res(resposta) direto na tela. Já map ele cria um array que retorna 
    os dados do tanto das transações quanto do os dados do próprio usuário. */
    res.send({
        avancarURL,
        previewURL,
        limit,
        offset,
        total,

        results: transacao.map(item => ({
            id: item._id,
            tipo: item.tipo,
            precoUnitario: item.precoUnitario,
            valorTotal: item.valorTotal,
            data: item.data,
            usuario: item.Usuario,
        })),
    });
};

export {
    criarTransacao,
    pesTransacao
};