import { Router } from "express";
import { esqueceuSenha, atualizarSenha } from "../controllers/esqueceu_senha.controller.js";

const rota = Router();

rota.post("/redefinir", esqueceuSenha);

rota.post("/atualizar", atualizarSenha);

export default rota;