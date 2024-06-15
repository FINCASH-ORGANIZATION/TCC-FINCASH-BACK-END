import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
//JWT, faz a tranmissão de informações de forma criptografada. Usado para autorizar o acesso do usuário, seja uma parte ou o sistema inteiro.

/* Const para chamar as informações que o usuário possui dentro do banco de dados pelo campo "email". Neste caso, .select(+senha) 
está sendo usado para, assim que for feita a requisição ao banco de dados, a senha também irá retornar nos campos, mas criptografada. */
export const loginService = (email) =>
  Usuario.findOne({ email: email }).select("+senha");

// Esta função geradorToken recebe um ID como parâmetro e retorna um token JWT assinado com a chave especificada/criptografada e com uma
// expiração de 48 horas (172800 segundos).
export const geradorToken = (id) =>
  jwt.sign({ id: id }, process.env.CHAVE_JWT, { expiresIn: 172800 });
