import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema({
    valor: {
        type: Number,
        required: true
    }, //valor, descricao, tipoTransacao, data, formaPagamento, conta, notas
    data: {
        type: Date,
        require: true
    },
    descricao: {
        type: String,
        required: false
    },
    tipoTransacao: {
        type: String,
        enum: ['despesa', 'receita'],
        required: true
    },
    categoriaReceita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoriaTransacao',
        required: false
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
        required: true
    },
});

const transacao = mongoose.model('transacao', transacaoSchema)

export default transacao;