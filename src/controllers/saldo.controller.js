import Transacao from "../models/transacao.js";
import Usuario from "../models/Usuario.js";

export const calcularSaldo = async (UsuarioId) => {
  try {
    const transacoes = await Transacao.find({ Usuario: UsuarioId }).populate(
      "Usuario"
    );
    let saldo = 0;
    transacoes.forEach((transacao) => {
      console.log(
        `Processando transação ${transacao.tipoTransacao} de valor ${transacao.valor}`
      );
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

export const atualizarSaldo = async (UsuarioId) => {
  try {
    const saldo = await calcularSaldo(UsuarioId);
    await Usuario.findByIdAndUpdate(UsuarioId, { saldo });
    return saldo;
  } catch (error) {
    throw new Error("Erro ao atualizar saldo: " + error.message);
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
