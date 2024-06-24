import transacao from "../models/transacao.js";

export const criartranService = (body) => transacao.create(body);

export const pestraService = (limit, offset) =>
  transacao
    .find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate("categoria")
    .populate("Usuario");

export const contarTranService = () => transacao.countDocuments();

export const pesIDService = (id) =>
  transacao.findById(id).populate("categoria").populate("Usuario");

export const pesqDescricaoService = (descricao, UsuarioId) =>
  transacao
    .find({
      descricao: { $regex: `${descricao || ""}`, $options: "i" },
      Usuario: UsuarioId,
    })
    .sort({ _id: -1 })
    .populate("categoria")
    .populate("Usuario");

export const pesUsuarioService = (id) =>
  transacao
    .find({ Usuario: id })
    .sort({ _id: -1 })
    .populate("categoria")
    .populate("Usuario");

export const atualizarTransService = (
  id,
  valor,
  data,
  descricao,
  tipoTransacao,
  categoria,
  formaPagamento,
  conta,
  categoriaPersonalizada
) =>
  transacao.findOneAndUpdate(
    { _id: id },
    {
      valor,
      data,
      descricao,
      tipoTransacao,
      categoria,
      formaPagamento,
      conta,
      categoriaPersonalizada,
    },
    { rawResult: true }
  );

export const deletarTransService = (id) =>
  transacao.findOneAndDelete({ _id: id });
