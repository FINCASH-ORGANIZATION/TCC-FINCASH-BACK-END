import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
  pesContaRota,
  pesContaIdRota,
  criarConta,
  deletarConta,
} from "../controllers/conta.controller.js";

const rota = Router();

// Rota para listar todas as contas que estão na conta logada
rota.get("/lista", authMiddlewares, pesContaRota);

// Rota para pesquisar uma conta pelo Id
rota.get("/:id", authMiddlewares, pesContaIdRota);

// Rota para criar uma conta
rota.post("/", authMiddlewares, criarConta);

// Rota para deletar uma conta
rota.delete("/:id", authMiddlewares, deletarConta);

export default rota;
