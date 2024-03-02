// Importa o módulo Mongoose, no qual permite o uso do script do mesmo;
const mongoose = require('mongoose');


/*
***********************************************************************************
*   Nome da variavel: Usuario;                                                    *   
*   Descrição: Uma variavel na qual armazena o esquema que será utilizado como    *  
*   modelo de dados para acessar e criar a "tabela" de usuario do banco de dados. *
*   Data de criação: 23/02/2023;                                                  *  
*   Ultima alteração:?;                                                           *        
***********************************************************************************     
*/

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
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
        required: false,
    },
});

// Define que a variavel "UsuarioSchema" se transforme em um modulo do mongoose.
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Exporta a variavel Usuario para que possa ser consumida em outro lugar, junto das funcionalidades do mongoose.
module.exports = Usuario;