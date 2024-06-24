import { calcularSaldo } from "../controllers/saldo.controller.js";
/* import Usuario from "../models/Usuario.js"; */
import Usuario
 from "../models/Usuario.js";
export const saldomiddleware = async (req, res, next) => {
  try {
    const usuarioId = req.body.usuarioId || req.params.usuarioId;
    console.log(`Calculando saldo para usuário ${usuarioId}`);
    const saldo = await calcularSaldo(usuarioId);
    console.log(`Saldo calculado: ${saldo}`);
    await Usuario.findByIdAndUpdate(usuarioId, { saldo });
    console.log(`Saldo atualizado para usuário ${usuarioId}`);
    next();
  } catch (error) {
    console.error(`Erro ao atualizar saldo do usuário: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};
