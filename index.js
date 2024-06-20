import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/database/db.js";
import usuarioRota from "./src/routes/usuario.route.js";
import authRota from "./src/routes/auth.route.js";
import transacaoRota from "./src/routes/transacao.route.js";
import esqueceuSenhaRota from "./src/routes/esqueceuSenha.route.js";
import categoriaRota from "./src/routes/categoriaTransacao.route.js";
import saldoRota from "./src/routes/saldo.route.js";
import cartoesRota from "./src/routes/cartoes.route.js";
import despesaRota from "./src/routes/despesa.route.js";
import receitaRota from "./src/routes/receita.route.js";
import contaRota from "./src/routes/conta.route.js";
import cors from "./src/middlewares/cors.middlewares.js";

dotenv.config();
const rota = express.Router();

connectDatabase();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors);

app.use("/usuario", usuarioRota);
app.use("/auth", authRota);
app.use("/transacao", transacaoRota);
app.use("/senha", esqueceuSenhaRota);
app.use("/categoria", categoriaRota);
app.use("/saldo", saldoRota);
app.use("/cartao", cartoesRota);
app.use("/despesa", despesaRota);
app.use("/receita", receitaRota);
app.use("/conta", contaRota);

app.listen(port, () => {
    console.log(`A porta está aberta em: ${port}`)
});