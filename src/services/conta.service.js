import Conta from "../models/conta.js";

/**
 * Cria uma nova conta com base nos dados fornecidos.
 */
export const criarContaService = async (data) => {
  try {
    console.log("Dados da conta recebidos:", data);

    const novaConta = new Conta(data);
    const contaSalva = await novaConta.save();

    console.log("Conta salva no banco de dados:", contaSalva);

    return contaSalva;
  } catch (error) {
    console.error(`Erro ao criar conta: ${error.message}`);
    throw new Error(`Erro ao criar conta: ${error.message}`);
  }
};

/**
 * Busca todas as contas do próprio usuário, populando o campo "Usuario".
 */
export const pesContaService = async () => {
  try {
    console.log("Pesquisando todas as contas do usuário");

    const contas = await Conta.find().populate("Usuario");

    console.log("Contas encontradas:", contas);

    return contas;
  } catch (error) {
    console.error(`Erro ao pesquisar contas: ${error.message}`);
    throw new Error(`Erro ao pesquisar contas: ${error.message}`);
  }
};

/**
 * Busca uma conta pelo seu ID, populando o campo "Usuario".
 */
export const pesContaIdService = async (id) => {
  try {
    console.log("Pesquisando conta por ID:", id);

    const conta = await Conta.findById(id).populate("Usuario");

    if (!conta) {
      throw new Error(`Conta não encontrada com ID: ${id}`);
    }

    console.log("Conta encontrada:", conta);

    return conta;
  } catch (error) {
    console.error(`Erro ao pesquisar conta por ID: ${id}: ${error.message}`);
    throw new Error(`Erro ao pesquisar conta por ID: ${id}: ${error.message}`);
  }
};

/**
 * Deleta uma conta com base no ID fornecido.
 */
export const deletarContaService = async (id) => {
  try {
    console.log("Deletando conta com ID:", id);

    const contaDeletada = await Conta.findByIdAndDelete(id);

    if (!contaDeletada) {
      throw new Error(`Conta não encontrada com ID: ${id}. Não foi possível deletar.`);
    }

    console.log("Conta deletada com sucesso:", contaDeletada);

    return contaDeletada;
  } catch (error) {
    console.error(`Erro ao deletar conta com ID: ${id}: ${error.message}`);
    throw new Error(`Erro ao deletar conta com ID: ${id}: ${error.message}`);
  }
};
