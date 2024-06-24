import { calcularSaldo } from "../controllers/saldo.controller.js";
import Usuario from "../models/Usuario.js";

export const saldomiddleware = async (req, res, next) => {
  try {
    const usuarioId = req.body.usuarioId || req.params.usuarioId;
    const saldo = await calcularSaldo(usuarioId);
    await Usuario.findByIdAndUpdate(usuarioId, { saldo });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
