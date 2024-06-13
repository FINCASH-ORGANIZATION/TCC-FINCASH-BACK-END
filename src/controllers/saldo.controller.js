import transacao from "../models/transacao.js";
import Usuario from "../models/Usuario.js";

export const calcularSaldo = async (UsuarioId) => {
  try {
    const transacoes = await transacao.find({ Usuario: UsuarioId });

    let saldo = 0;
    transacoes.forEach((transacao) => {
      if (transacao.tipoTransacao === "Receita") {
        saldo += transacao.valor;
      } else if (transacao.tipoTransacao === "Despesa") {
        saldo -= transacao.valor;
      }
    });

    return saldo;
  } catch (error) {
    throw new Error("Erro ao calcular saldo: " + error.message);
  }
};

export const atualizarSaldo = async (req, res) => {
  try {
    const UsuarioId = req.body.UsuarioId || req.params.id;
    const saldo = await calcularSaldo(UsuarioId);
    await Usuario.findByIdAndUpdate(UsuarioId, { saldo });
    res.status(200).send({ saldo });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const exibirSaldo = async (req, res) => {
  try {
    const UsuarioId = req.params.id;
    const saldo = await calcularSaldo(UsuarioId);
    return res.status(200).send({ saldo });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
