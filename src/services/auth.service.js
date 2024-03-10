import Usuario from '../models/Usuario.js'

const loginService = (email) => Usuario.findOne({ email: email }).select("+senha");

export { loginService };