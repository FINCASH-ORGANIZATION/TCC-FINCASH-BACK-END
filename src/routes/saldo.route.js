import { Router } from "express";
import {
  atualizarSaldo,
  exibirSaldo,
} from "../controllers/saldo.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";

const rota = Router();

rota.get("/:id", authMiddlewares, exibirSaldo);
rota.patch("/:id", authMiddlewares, atualizarSaldo);

export default rota;
