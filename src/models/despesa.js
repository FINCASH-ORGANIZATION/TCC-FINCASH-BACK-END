import mongoose from 'mongoose';

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
    default: Date.now
  },
  categoria: {
    type: String,
    required: true
  },
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

const despesa = mongoose.model("despesa", despesaSchema);

export default despesa;
