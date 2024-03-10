import { Router } from 'express';
const rota = Router();

import { login } from "../controllers/auth.controller.js";

rota.post("/", login);

export default rota;