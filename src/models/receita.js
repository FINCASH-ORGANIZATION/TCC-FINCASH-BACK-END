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
  },
  categoria: {
    type: String,
    required: false,
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
