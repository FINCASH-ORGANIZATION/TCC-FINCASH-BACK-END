import { Router } from "express";
const rota = Router();

import {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesTituloRota
} from "../controllers/transacao.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";

rota.post("/", authMiddlewares, criarTransacaoRota);
rota.get("/", pesTransacaoRota);
rota.get("/pesquisar", pesTituloRota);
rota.get("/:id", pesquisaIDRota);


export default rota;