//RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB, PEGA OS DADOS JSON INSERIDOS NO BODY E DEVOLVE NA VARIAVEL CREATE,
//QUE POR SUA VEZ ARMAZENA OS VALORES DO USUARIO

import Usuario from "../models/Usuario.js";

const criarUsu = (body) => Usuario.create(body); //Cria o usuario com base no modelo importado contendo as informações do mesmo no banco
const pesUsuService = () => Usuario.find(); //Pesquisa o usuario no banco
const pesUsuIdService = (idUsuario) => Usuario.findById(idUsuario); // Pesquisa o ID do usuario no banco
const UsuUpdateService = async (id, nome, senha, email, telefone, avatar, resetTokenSenha, expiracaoTokenSenha) => {
    const usuario = await Usuario.findById(id);

    if (nome) usuario.nome = nome;
    if (senha) usuario.senha = senha;
    if (email) usuario.email = email;
    if (telefone) usuario.telefone = telefone;
    if (avatar) usuario.avatar = avatar;
    if (resetTokenSenha) usuario.senhatoken = resetTokenSenha;
    if (expiracaoTokenSenha) usuario.tempoExpiracao = expiracaoTokenSenha;


    await usuario.save();
    return usuario;
};

export default {
    criarUsu,
    pesUsuService,
    pesUsuIdService,
    UsuUpdateService,
};