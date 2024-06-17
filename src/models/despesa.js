import mongoose from "mongoose";

const despesaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  formaPagamento: {
    type: String,
    required: true
  },
  conta: {
    type: String,
    required: true
  },
  notas: {
    type: String,
    default: null
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

const despesa = mongoose.model('despesa', despesaSchema);

export default despesa;