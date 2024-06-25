import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  tipoTransacao: {
    type: String,
    enum: ["Despesa", "Receita"],
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoriaTransacao",
    required: true,
  },
  formaPagamento: {
    type: String,
    required: false,
  },
  conta: {
    type: String,
    required: true,
  },
  notas: {
    type: String,
    default: null,
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const transacao = mongoose.model("transacao", transacaoSchema);

export default transacao;
