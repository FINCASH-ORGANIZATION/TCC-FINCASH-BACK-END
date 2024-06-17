import mongoose from "mongoose";

const CartaoCreditoSchema = new mongoose.Schema({
    nomeCartao: {
        type: String,
        required: true
    }, // nomeCartao, limite, descricao, fechamento, vencimento, conta
    limite: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    fechamento: {
        type: String,
        required: true
    },
    vencimento: {
        type: String,
        required: true
    },
    conta: {
        type: String,
        required: true
    },
    /* bandeira: {
        type: String,
        required: true
    }, */
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});
const cartao = mongoose.model('cartao', CartaoCreditoSchema);

export default cartao;