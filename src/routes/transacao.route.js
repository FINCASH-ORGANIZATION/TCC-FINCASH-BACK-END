import {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesDescricaoRota,
    pesUsuarioRota,
    atualizarTrans,
    deletarTrans
} from "../controllers/transacao.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { saldomiddleware } from "../middlewares/saldo.middleware.js";
import { Router } from "express";

const rota = Router();

rota.post("/", authMiddlewares, criarTransacaoRota, saldomiddleware);
rota.get("/", pesTransacaoRota);
rota.get("/pesquisar", pesDescricaoRota);
rota.get("/pesUsuarioRota", authMiddlewares, pesUsuarioRota);
rota.get("/:id", pesquisaIDRota);
rota.patch("/:id", authMiddlewares, atualizarTrans, saldomiddleware)
rota.delete("/:id", authMiddlewares, deletarTrans, saldomiddleware);

export default rota;    