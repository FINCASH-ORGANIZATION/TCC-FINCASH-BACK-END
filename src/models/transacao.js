import mongoose, {Types} from "mongoose";
import categoriaTransacao from "./categoriaTransacao.js";

const transacaoSchema = new mongoose.Schema({
    // Tipo de transação (compra, venda, dividendos, etc.)
    tipo: {
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
    // Data da transação
    data: {
        type: Date,
        default: Date.now(),
    },
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    categoriaReceita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaTransacao',
        required: false,
    },
});

const transacao = mongoose.model('transacao', transacaoSchema )

export default transacao;


