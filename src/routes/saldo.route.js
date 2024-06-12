import { Router } from "express";
import { atualizarSaldo, exibirSaldo } from '../controllers/saldo.controller.js';

const rota = Router();

rota.patch('/:id', atualizarSaldo);
rota.get('/:id', exibirSaldo);

export default rota;