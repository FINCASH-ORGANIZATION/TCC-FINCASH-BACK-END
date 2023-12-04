// Importa o módulo Mongoose
const mongoose = require('mongoose');

// Define o Schema do Model de Usuário
const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
});

// Cri o Model de Usuário
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Exporta o Model de Usuário
module.exports = Usuario;