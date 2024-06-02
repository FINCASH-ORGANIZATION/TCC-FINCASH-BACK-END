import categoriaTransacao from "../models/categoriaTransacao.js";

export const pesCategoriasRota = async (req, res) => {
    try {
        const categorias = await categoriaTransacao.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const pesCategoriaPorIdRota = async (req, res) => {
    try {
        const categoria = await categoriaTransacao.findById(req.params.id);
        if (!categoria) {
            return res.status(404).send({ mensagem: "Categoria não encontrada!" });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};