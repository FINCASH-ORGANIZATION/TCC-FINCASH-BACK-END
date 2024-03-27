import { Router } from "express";
const rota = Router();

import {criarTransacao, pesTransacao} from "../controllers/transacao.controller.js"
import { authMiddlewares } from "../middlewares/auth.middlewares.js";

rota.post("/", authMiddlewares, criarTransacao)
rota.get("/", pesTransacao)

export default rota;