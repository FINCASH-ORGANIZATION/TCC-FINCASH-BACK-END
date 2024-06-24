import Transacao from "../models/transacao.js";
import Usuario from "../models/Usuario.js";

export const calcularSaldo = async (UsuarioId) => {
  try {
    console.log(`Buscando transações para usuário ${UsuarioId}`);
    const transacoes = await Transacao.find({ usuario: UsuarioId }).populate(
      "usuario"
    );
    console.log(`Transações encontradas: ${transacoes.length}`);

    let saldo = 0;
    transacoes.forEach((transacao) => {
      console.log(
        `Processando transação ${transacao.tipoTransacao} de valor ${transacao.valor}`
      );
      if (transacao.tipoTransacao === "Receita") {
        console.log(`Adicionando valor de receita: ${transacao.valor}`);
        saldo += transacao.valor;
      } else if (transacao.tipoTransacao === "Despesa") {
        console.log(`Subtraindo valor de despesa: ${transacao.valor}`);
        saldo -= transacao.valor;
      }
    });

    console.log(`Saldo calculado: ${saldo}`);
    return saldo;
  } catch (error) {
    console.error(`Erro ao calcular saldo: ${error.message}`);
    throw new Error("Erro ao calcular saldo: " + error.message);
  }
};

export const atualizarSaldo = async (UsuarioId) => {
  try {
    console.log(`Atualizando saldo para usuário ${UsuarioId}`);
    const saldo = await calcularSaldo(UsuarioId);
    console.log(`Saldo atualizado: ${saldo}`);
    await Usuario.findByIdAndUpdate(UsuarioId, { saldo });
    return saldo;
  } catch (error) {
    console.error(`Erro ao atualizar saldo: ${error.message}`);
    throw new Error("Erro ao atualizar saldo: " + error.message);
  }
};

export const exibirSaldo = async (req, res) => {
  try {
    const UsuarioId = req.params.id;
    console.log(`Exibindo saldo para usuário ${UsuarioId}`);
    const saldo = await calcularSaldo(UsuarioId);
    console.log(`Saldo exibido: ${saldo}`);
    return res.status(200).send({ saldo });
  } catch (error) {
    console.error(`Erro ao exibir saldo: ${error.message}`);
    res.status(400).send({ message: error.message });
  }
};
