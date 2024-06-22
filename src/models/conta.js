import mongoose from "mongoose";

const contaSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true,
    min: 1,
  },
  descricao: {
    type: String,
    required: false,
  },
  banco: {
    type: String,
    enum: ["Banco do Brasil", "Caixa", "Itau", "Santander", "Nubank", "Bradesco", "Inter"],
    required: false,  
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const Conta = mongoose.model("Conta", contaSchema);

export default Conta;