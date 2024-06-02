import mongoose from "mongoose";

const categoriaTransacaoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: [
            'Salário',
            'Alimentação',
            'Transporte',
            'Saúde',
            'Educação',
            'Lazer e entretenimento',
            'Viagens',
            'Emergências',
            'Outros'
        ],
        required: true,
    },
    categoriaPersonalizada: {
        type: String,
        default: null,
    },
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
});

const categoriaTransacao = mongoose.model('categoriaTransacao', categoriaTransacaoSchema);

export default categoriaTransacao;