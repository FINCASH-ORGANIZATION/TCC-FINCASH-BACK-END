import mongoose from "mongoose";

const categoriaReceitaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    // Tipo da categoria: "gasto" ou "receita".
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
    // Campo para categoria personalizada quando o usuário escolher a opção "Outros"
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

const CategoriaTransacao = mongoose.model('CategoriaTransacao', categoriaReceitaSchema)

export default CategoriaTransacao;