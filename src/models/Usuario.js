// Importa o módulo Mongoose, no qual permite o uso do script do mesmo;
// Importa o módulo do bcrypt, responsável pela criptografia de senha. 
import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true,
        select: false
    },
    telefone: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: false,
    }
});
/* 
UsuarioSchema.pre("save", async function (next) {
    this.senha = await bcrypt.hash(this.senha, 10);

    next();
}); */

UsuarioSchema.pre("save", async function () {
    if (this.isModified('senha')) {
        this.senha = await Usuario.hash(this.senha, 10)
    }
})
UsuarioSchema.statics.hash = function (senha) {
    return bcrypt.hash(senha, 10)
}


// Define que a variavel "UsuarioSchema" se transforme em um modulo do mongoose.
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Exporta a variavel Usuario para que possa ser consumida em outro lugar, junto das funcionalidades do mongoose.
export default Usuario;