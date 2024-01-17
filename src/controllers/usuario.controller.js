const usuarioService = require("../services/Usuario.service");
const mongoose = require('mongoose');

const criarUsu = async (req, res) => {
    const { nome, senha, email, telefone } = req.body;
    const Usuario = await usuarioService.criarUsu(req.body)
    //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE
    if (!nome || !senha || !email || !telefone) {
        res.status(400).json({ menssagem: "Por favor, preencha todos os campos para se registrar!" })
    }

    //      DEVOLVE A MENSAGEM DE ERRO E STATUS PARA O BANCO E USUARIO
    if (!Usuario) {
        return res.status(400).send({ menssagem: "Erro na criação do usuario" });
    }
    //DEVOLVE PARA O USUARIO A RESPOSTA COM OS DADOS INSERIDOS E SE FOI REALMENTE CRIADO
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
const pesUsu = async (req, res) => {
    const Usuarios = await usuarioService.pesUsuService();

    if (Usuarios.lenght === 0) {
        return res.status(400).send({ menssagem: "Não há usuarios cadastrados" })
    }
    res.send(Usuarios)
};
const pesUsuId = async (req, res) => { //Function de verificação de usuarios e a Id dos mesmos
    const id = req.params.id; //Faz a requisição do id

    if (!mongoose.Types.ObjectId.isValid(id)) { //If feito para verificar se o id existe no banco de dados
        return res.status(400).send({ menssagem: "Esse ID não é valido" })
    };

    const UsuarioId = await usuarioService.pesUsuIdService(id) //Solicita o ID no banco de dados para enviar ao usuario

    if (!UsuarioId) { //IF feito caso o usuario não seja encontrado/não exista no bd
        return res.status(400).send({ Menssagem: "Usuario não emcontrado" })
    };

    res.send(UsuarioId); //Retorna ao usuario a exibição do nome, idade e afins

};
const UsuUpdate = async (req, res) => {
    const { nome, senha, email, telefone } = req.body;

    //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE
    if (!nome && !senha && !email && !telefone) {
        res.status(400).json({ menssagem: "Por favor, preencha pelo menos um campo para fazer a alteração!" })
    }

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) { //If feito para verificar se o id existe no banco de dados
        return res.status(400).send({ menssagem: "Esse ID não é valido" })
    };

    const Usuario = await usuarioService.pesUsuIdService(id);

    if (!Usuario) {
        return res.status(400).send({ menssagem: "Erro na identificação do usuario" });
    }

    await usuarioService.UsuUpdateService(
        id,
        nome,
        senha,
        email,
        telefone
    );

    res.send({ menssagem: "Usuario alterado com sucesso" });

};

//exporta os modules, o que cria o usuario no bd, o que pesquisa, o que pesquisa pelo ID e o que faz update
module.exports = {
    criarUsu,
    pesUsu,
    pesUsuId,
    UsuUpdate
};
