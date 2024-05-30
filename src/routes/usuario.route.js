// IMPORTAÇÃO DA BIBLIOTECA EXPRESS NA FUNÇÃO ROUTER
import express from 'express';
import { Router } from 'express';

const rota = Router();
// **********************************************************************************************************************
import { criarUsu, pesUsu, pesUsuId, UsuUpdate, deletarUsu } from '../controllers/usuario.controller.js';
import { validacaoId, validacaoUsuario } from "../middlewares/global.middlewares.js";

rota.post("/", criarUsu);
rota.get("/", pesUsu);
rota.get("/:id", validacaoId, validacaoUsuario, pesUsuId);
rota.patch("/:id", validacaoId, validacaoUsuario, UsuUpdate);
rota.delete("/:id", validacaoId, validacaoUsuario, deletarUsu);

//  Exporta a variavel rota que irá ser chamada pelo controller.
export default rota;