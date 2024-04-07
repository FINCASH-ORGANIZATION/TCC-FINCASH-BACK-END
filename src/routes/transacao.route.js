import { Router } from "express";
const rota = Router();

import {criarTransacao, pesTransacao, pesquisaID} from "../controllers/transacao.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";

rota.post("/", authMiddlewares, criarTransacao);
rota.get("/", pesTransacao);
rota.get("/:id", pesquisaID);

export default rota;