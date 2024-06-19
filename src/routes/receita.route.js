import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    pesReceita,
    receitaId,
    criarReceita,
    atualizarReceita,
    deletarReceita,
} from "../controllers/receita.controller.js";

const rota = Router();

// Rota para listar todos os cartões de crédito
rota.get('/receita', authMiddlewares, pesReceita);

// Rota para pesquisar o cartão pelo Id
rota.get("/:id", authMiddlewares, receitaId);

// Rota para criar um novo cartão de crédito
rota.post('/receita', authMiddlewares, criarReceita);

// Rota para atualizar um cartão de crédito
rota.patch('/receita/:id', authMiddlewares, atualizarReceita);

// Rota para deletar um cartão de crédito
rota.delete('/receita/:id', authMiddlewares, deletarReceita);

export default rota;