import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
  pesReceitaRota,
  criarReceita,
  deletarReceita,
} from "../controllers/receita.controller.js";

const rota = Router();

// Rota para listar todas as receitas que tem na conta do usuário
rota.get("/lista", authMiddlewares, pesReceitaRota);

// Rota para criar uma receita
rota.post("/", authMiddlewares, criarReceita);

// Rota para deletar uma receita
rota.delete("/:id", authMiddlewares, deletarReceita);

export default rota;
