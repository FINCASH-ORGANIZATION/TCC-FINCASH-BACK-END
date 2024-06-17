import mongoose from "mongoose";

// função para apenas numeros de 01 até 31 sejam aceitos
const validDays = {
    type: Number,
    required: true,
    validate: {
        validator: function (value) {
            // Verifica se o valor está entre 1 e 31
            return value >= 1 && value <= 31;
        },
        message: props => `não é um dia válido. O dia deve ser entre 1 e 31.`
    }
};

const CartaoCreditoSchema = new mongoose.Schema({
    nomeCartao: {
        type: String,
        required: true
    },
    limite: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    fechamento: validDays,
    vencimento: validDays,
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
        required: true,
    },
}, {
    timestamps: true
});
const cartao = mongoose.model('cartao', CartaoCreditoSchema);

export default cartao;