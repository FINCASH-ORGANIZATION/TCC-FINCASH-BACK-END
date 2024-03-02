const mongoose = require('mongoose');
const usuarioService = require("../services/Usuario.service");

const validacaoId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) { //If feito para verificar se o id existe no banco de dados
        return res.status(400).send({ Mensagem: "Esse ID não é valido" })
    };

};

const validacaoUsuario = async (req, res, next) => {
    const id = req.params.id;

    const Usuario = await usuarioService.findById(id);

    if (!Usuario) {
        return res.status(400).send({ menssagem: "Usuario não existe" });
    };

};


module.exports = {
    validacaoId,
    validacaoUsuario,
}