import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
    pesReceitaRota,
    receitaId,
    receitaDescricaoRota,
    criarReceita,
    atualizarReceita,
    deletarReceita,
} from "../controllers/receita.controller.js";

const rota = Router();

// Rota para listar todas as receitas que tem na conta do usuário
rota.get("/lista", authMiddlewares, pesReceitaRota);

// Rota para pesquisar a receita pelo Id
rota.get("/:id", authMiddlewares, receitaId);

// Rota para pesquisar a receita pela sua descrição
rota.get("/descricao", receitaDescricaoRota);

// Rota para criar uma receita
rota.post("/", authMiddlewares, criarReceita);

// Rota para atualizar uma receita
rota.patch("/:id", authMiddlewares, atualizarReceita);

// Rota para deletar uma receita
rota.delete("/:id", authMiddlewares, deletarReceita);

export default rota;