import mongoose, {Types} from "mongoose";

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
            'Moradia',
            'Alimentação',
            'Transporte',
            'Saúde',
            'Educação',
            'Lazer e entretenimento',
            'Vestuário e acessórios',
            'Finanças pessoais',
            'Casa e decoração',
            'Comunicação',
            'Seguro',
            'Impostos',
            'Presentes e doações',
            'Animais de estimação',
            'Manutenção do carro',
            'Despesas bancárias',
            'Despesas diversas',
            'Eletrodomésticos e eletrônicos',
            'Assinaturas e mensalidades',
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

const categoriaTransacao = mongoose.model('categoriaTransacao', categoriaReceitaSchema )

export default categoriaTransacao;