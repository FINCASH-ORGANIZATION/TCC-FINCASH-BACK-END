import categoriaTransacao from "../models/categoriaTransacao.js";

// Rota para buscar todas as categorias de transação
export const pesCategoriasRota = async (req, res) => {
  try {
    const categorias = await categoriaTransacao.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Rota para buscar uma categoria de transação por ID
export const pesCategoriaPorIdRota = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaTransacao.findById(id);
    if (!categoria) {
      return res.status(404).send({ mensagem: "Categoria não encontrada!" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
