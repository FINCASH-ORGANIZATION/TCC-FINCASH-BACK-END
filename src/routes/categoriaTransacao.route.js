import { Router } from "express";
import {
  pesCategoriasRota,
  pesCategoriaPorIdRota,
} from "../controllers/categoriaTransacao.controller.js";

const rota = Router();

rota.get("/", pesCategoriasRota);
rota.get("/:id", pesCategoriaPorIdRota);

export default rota;
