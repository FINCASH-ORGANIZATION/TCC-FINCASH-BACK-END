const usuarioService = require("../services/Usuario.service")
const criar = async (req, res) => {
    const { nome, senha, email, telefone } = req.body;

    if (!nome || !senha || !email || !telefone) {
        res.status(400).json({ menssagem: "Por favor, preencha todos os campos para se registrar!" })
    }

    const Usuario = await usuarioService.create(req.body)

    if (!Usuario) {
        return res.status(400).send({ menssagem: "Erro na criação do usuario" });
    }

    res.status(201).json({
        Menssagem: "Usuario cadastrado com sucesso!",
        Usuario: {
            id: Usuario._id,
            nome,
            email,
            senha,
            telefone,
        },
    })
};

module.exports = { criar };