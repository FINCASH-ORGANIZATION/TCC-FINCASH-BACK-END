import mongoose from "mongoose";

// Esquema para uma categoria de gasto ou receita
const categoriaReceitaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: false,
    },
    // Tipo da categoria: "gasto" ou "receita"'
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
    Usuario: {
        type: Types.ObjectId,
        ref: 'Usuario',
        required: true,
    }
});

const categoriaTransacao = mongoose.model('categoriaTransacao', categoriaReceitaSchema)

export default categoriaTransacao;
