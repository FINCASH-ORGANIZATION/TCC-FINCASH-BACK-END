import { Router } from "express";
const rota = Router();

import {criarTransacao, pesTransacao} from "../controllers/transacao.controller.js"

rota.post("/", criarTransacao)
rota.get("/", pesTransacao)

export default rota;