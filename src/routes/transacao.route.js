import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesTipoRota
} from "../controllers/transacao.controller.js";
import { Router } from "express";
const rota = Router();

rota.post("/", authMiddlewares, criarTransacaoRota);
rota.get("/", pesTransacaoRota);
rota.get("/pesquisar", pesTipoRota);
rota.get("/:id", pesquisaIDRota);

export default rota;    