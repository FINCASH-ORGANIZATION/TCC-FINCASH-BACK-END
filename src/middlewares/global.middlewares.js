import mongoose from "mongoose";
import { pesUsuIdService } from "../services/Usuario.service.js";


export const validacaoId = (req, res, next) => {
    const id = req.params.id; // Faz a requisição do ID

    // If feito para verificar se o ID existe no banco de dados
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ Mensagem: "Esse ID não é valido" })
    };

    next(); // Depois que valida o ID, libera para a próxima função/const

};

export const validacaoUsuario = async (req, res, next) => {
    const id = req.params.id; // Faz a requisição do ID para assim, encontrar o usuario desejado 

    // Const para fazer a verificação do usuário dentro do banco de dados, 'AWAIT' para aguardar uma resposta do banco de dados
    const Usuario = await pesUsuIdService(id);

    // MENSAGEM DE ERROR PARA CASO O USUÁRIO NÃO EXISTA DENTRO DO BANCO DE DADOS
    if (!Usuario) {
        return res.status(400).send({ Mensagem: "Usuario não existe" });
    };

    req.id = id;
    req.Usuario = Usuario;

    next();
};