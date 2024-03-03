const mongoose = require('mongoose');
const usuarioService = require("../services/Usuario.service");

const validacaoId = (req, res, next) => {
    const id = req.params.id; // Faz a requisição do ID

    // If feito para verificar se o ID existe no banco de dados
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ Mensagem: "Esse ID não é valido" })
    };

    next(); // Depois que valida o ID e passa do 'IF', libera para a próxima função/const

};

const validacaoUsuario = async (req, res, next) => {
    const id = req.params.id; 

    const Usuario = await usuarioService.pesUsuIdService(id); 
    
    // If feito para verificar se o Usuario existe no banco de dados
    if (!Usuario) {
        return res.status(400).send({ Mensagem: "Usuario não existe" });
    };

    req.id = id;
    req.Usuario = Usuario;

    next();
};

module.exports = {
    validacaoId,
    validacaoUsuario,
}