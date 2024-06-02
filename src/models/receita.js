import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true,
        min: 1
    },
    data: {
        type: Date,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    formaRecebimento: {
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

const Receita = mongoose.model('Receita', receitaSchema);

export default Receita;