// IMPORTAÇÃO DA BIBLIOTECA EXPRESS NA FUNÇÃO ROUTER
import express from 'express';
import { Router } from 'express';

const rota = Router();
// **********************************************************************************************************************
import usuarioController from '../controllers/usuario.controller.js';
import { validacaoId, validacaoUsuario } from "../middlewares/global.middlewares.js";

rota.post("/", usuarioController.criarUsu);
rota.get("/", usuarioController.pesUsu);
rota.get("/:id", validacaoId, validacaoUsuario, usuarioController.pesUsuId);
rota.patch("/:id", validacaoId, validacaoUsuario, usuarioController.UsuUpdate);

//  Exporta a variavel rota que irá ser chamada pelo controller.
export default rota;