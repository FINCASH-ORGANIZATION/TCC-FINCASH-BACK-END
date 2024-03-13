import Usuario from '../models/Usuario.js'

/* 
Const para chamar as informações que o usuário possui dentro do banco de dados pelo campo "email". Neste caso, .select(+senha) 
está sendo usado para, assim que for feita a requisição ao banco de dados, a senha também irá retornar nos campos, mas criptografada.
*/

const loginService = (email) => Usuario.findOne({ email: email }).select("+senha");

export { loginService };