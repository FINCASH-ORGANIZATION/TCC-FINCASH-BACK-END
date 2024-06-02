import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema({
    // Tipo de transação (compra, venda, dividendos, etc.)
    tipoTransacao: {
        type: String,
        required: false,
    },
    // Descrição para ficar mais fácil de 
    descricao: {
        type: String,
        required: true,
    },
    // Preço unitário da transação
    precoUnitario: {
        type: Number,
        required: true,
    },
    // Valor total da transação
    valorTotal: {
        type: Number,
        required: true,
    },
    // Data que foi feita a transação
    data: {
        type: Date,
        require: true
    },
    conta: {
        type: String,
        required: false,
    },
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    categoriaReceita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoriaTransacao',
        required: false,
    },
});

const transacao = mongoose.model('transacao', transacaoSchema)

export default transacao;