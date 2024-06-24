import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
    get: v => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`
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
    type: String,
        enum: [
            'Salário',
            'Alimentação',
            'Transporte',
            'Saúde',
            'Educação',
            'Lazer e entretenimento',
            'Viagens',
            'Emergências',
            'Outros'
        ],
        required: true,
    },
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conta",
    required: true,
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const transacao = mongoose.model("transacao", transacaoSchema);

export default transacao;
