import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    criarCartao,
    despesaId,
    atualizarCartao,
    deletarCartao,
} from "../controllers/cartao.controller.js";

const rota = Router();

// Rota para listar todos os cartões de crédito
rota.get('/despesa', authMiddlewares, pesCartaoRota);

// Rota para pesquisar o cartão pelo Id
rota.get("/:id", authMiddlewares, pesCartaoIdRota);

// Rota para criar um novo cartão de crédito
rota.post('/despesa', authMiddlewares, criarCartao);

// Rota para atualizar um cartão de crédito
rota.patch('/despesa/:id', authMiddlewares, atualizarCartao);

// Rota para deletar um cartão de crédito
rota.delete('/despesa/:id', authMiddlewares, deletarCartao);

export default rota;