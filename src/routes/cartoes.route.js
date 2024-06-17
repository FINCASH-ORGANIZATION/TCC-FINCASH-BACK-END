import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
/* import cartaoCredito from '../models/Cartoes.js'; */

const rota = Router();

// Rota para criar um novo cartão de crédito
rota.post('/credito', authMiddlewares);
rota.patch('/credito', authMiddlewares);
rota.delete('/credito', authMiddlewares);

export default rota;