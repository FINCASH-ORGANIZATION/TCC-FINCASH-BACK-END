//RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB, PEGA OS DADOS JSON INSERIDOS NO BODY E DEVOLVE NA VARIAVEL CREATE,
//QUE POR SUA VEZ ARMAZENA OS VALORES DO USUARIO

import Usuario from "../models/Usuario.js";

export const criarUsuService = (body) => Usuario.create(body); //Cria o usuario com base no modelo importado contendo as informações do mesmo no banco
export const pesUsuService = () => Usuario.find(); //Pesquisa o usuario no banco
export const pesUsuIdService = (idUsuario) => Usuario.findById(idUsuario); // Pesquisa o ID do usuario no banco
export const atualizarUsuService = async (
  id,
  nome,
  sobrenome,
  senha,
  email,
  avatar,
  resetTokenSenha,
  expiracaoTokenSenha
) => {
  const usuario = await Usuario.findById(id);

  if (nome) usuario.nome = nome;
  if (sobrenome) usuario.sobrenome = sobrenome;
  if (senha) usuario.senha = senha;
  if (email) usuario.email = email;
  if (avatar) usuario.avatar = avatar;
  if (resetTokenSenha) usuario.senhatoken = resetTokenSenha;
  if (expiracaoTokenSenha) usuario.tempoExpiracao = expiracaoTokenSenha;

  await usuario.save();
  return usuario;
};

export const deletarUsuService = (id) => Usuario.findByIdAndDelete({ _id: id });
