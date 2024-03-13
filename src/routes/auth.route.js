import { Router } from 'express';

/* Rota para autenticação de login por meio do email e senha do usuário, utilizando o POST */
const rota = Router();

import { login } from "../controllers/auth.controller.js";

rota.post("/", login);

export default rota;