import mongoose from "mongoose";

const DespesaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  categoria: {
    type: String,
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

const Despesa = mongoose.model("Despesa", DespesaSchema);

export default Despesa;
