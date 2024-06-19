import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    pesDespesa,
    despesaId,
    criarDespesa,
    atualizarDespesa,
    deletarDespesa,
} from "../controllers/despesa.controller.js";

const rota = Router();

// Rota para listar todos os cartões de crédito
rota.get('/despesa', authMiddlewares, pesDespesa);

// Rota para pesquisar o cartão pelo Id
rota.get("/:id", authMiddlewares, despesaId);

// Rota para criar um novo cartão de crédito
rota.post('/despesa', authMiddlewares, criarDespesa);

// Rota para atualizar um cartão de crédito
rota.patch('/despesa/:id', authMiddlewares, atualizarDespesa);

// Rota para deletar um cartão de crédito
rota.delete('/despesa/:id', authMiddlewares, deletarDespesa);

export default rota;