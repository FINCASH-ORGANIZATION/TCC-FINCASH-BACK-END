import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    criarCartao,
    pesCartaoRota,
    pesCartaoIdRota,
    atualizarCartao,
    deletarCartao,
} from "../controllers/cartao.controller.js";

const rota = Router();

// Rota para listar todos os cartões de crédito
rota.get("/credito", authMiddlewares, pesCartaoRota);

// Rota para pesquisar o cartão pelo Id
rota.get("/:id", authMiddlewares, pesCartaoIdRota);

// Rota para criar um novo cartão de crédito
rota.post("/credito", authMiddlewares, criarCartao);

// Rota para atualizar um cartão de crédito
rota.patch("/credito/:id", authMiddlewares, atualizarCartao);

// Rota para deletar um cartão de crédito
rota.delete("/credito/:id", authMiddlewares, deletarCartao);

export default rota;