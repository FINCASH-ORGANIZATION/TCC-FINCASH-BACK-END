import mongoose from "mongoose";

const contaSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true,
    min: 1,
  },
  descricao: {
    type: String,
    required: true,
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const conta = mongoose.model("conta", contaSchema);

export default conta;
