import { Router } from 'express';

/* Rota para autenticação de login por meio do email e senha do usuário, utilizando o POST */
const rota = Router();

import { login, esqueceuSenha, atualizarSenha } from "../controllers/auth.controller.js";

rota.post("/", login);

rota.post('/esqueceu_senha', esqueceuSenha);

rota.post('/atualizar_senha', atualizarSenha)

export default rota;