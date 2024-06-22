import { Router } from "express";
import { atualizarSaldo, exibirSaldo } from "../controllers/saldo.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";


const rota = Router();

rota.patch("/:id", authMiddlewares, atualizarSaldo);
rota.get("/:id", authMiddlewares, exibirSaldo);

export default rota;