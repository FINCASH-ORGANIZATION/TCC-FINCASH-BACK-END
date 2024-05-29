import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesDescricaoRota,
    pesUsuarioRota,
    atualizarTrans,
    deletarTrans
} from "../controllers/transacao.controller.js";
import { Router } from "express";

const rota = Router();

rota.post("/", authMiddlewares, criarTransacaoRota);
rota.get("/", pesTransacaoRota);
rota.get("/pesquisar", pesDescricaoRota);
rota.get("/pesUsuarioRota", authMiddlewares, pesUsuarioRota);
rota.get("/:id", pesquisaIDRota);
rota.patch("/:id", authMiddlewares, atualizarTrans)
rota.delete("/:id", authMiddlewares, deletarTrans);

export default rota;    