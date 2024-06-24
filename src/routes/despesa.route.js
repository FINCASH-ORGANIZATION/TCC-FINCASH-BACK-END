import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
  pesDespesaRota,
  criarDespesa,
  deletarDespesa,
} from "../controllers/despesa.controller.js";

const rota = Router();

// Rota para listar todas as Despesas que tem na conta do usuário
rota.get("/lista", authMiddlewares, pesDespesaRota);

// Rota para criar uma Despesa
rota.post("/", authMiddlewares, criarDespesa);

// Rota para deletar uma Despesa
rota.delete("/:id", authMiddlewares, deletarDespesa);

export default rota;