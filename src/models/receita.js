import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  data: {
    type: Date,
    default: Date.now,
    get: v => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`
  },
  categoria: {
    type: String,
    required: true,
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conta",
    required: true,
  },
});

const Receita = mongoose.model("Receita", receitaSchema);

export default Receita;
