import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    pesDespesaRota,
    despesaId,
    despesaDescricaoRota,
    criarDespesa,
    atualizarDespesa,
    deletarDespesa,
} from "../controllers/despesa.controller.js";

const rota = Router();

// Rota para listar todas as despesas que estão na conta logada
rota.get("/lista", authMiddlewares, pesDespesaRota);

// Rota para pesquisar uma despesa pelo Id
rota.get("/:id", authMiddlewares, despesaId);

// Rota para pesquisar uma despesa pela sua descrição
rota.get("/descricao", authMiddlewares, despesaDescricaoRota);

// Rota para criar uma despesa
rota.post("/", authMiddlewares, criarDespesa);

// Rota para atualizar uma despesa
rota.patch("/:id", authMiddlewares, atualizarDespesa);

// Rota para deletar uma despesa
rota.delete("/:id", authMiddlewares, deletarDespesa);

export default rota;