import Conta from "../models/conta.js";
import transacao from "../models/transacao.js";

export const obterSaldoService = async (usuarioId) => {
  try {
    const transacoes = await transacao.find({ Usuario: usuarioId });

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
    throw new Error("Erro ao obter saldo.");
  }
};
