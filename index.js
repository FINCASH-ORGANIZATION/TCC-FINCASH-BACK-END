import express from 'express';
import connectDatabase from "./src/database/db.js";
import dotenv from "dotenv";


dotenv.config();
const rota = express.Router();

import usuarioRota from "./src/routes/usuario.route.js";
import authRota from "./src/routes/auth.route.js";


connectDatabase() // Estabelece a conexão com o banco de dados

const app = express() // Define que o express será utilizado pelo app
const port = process.env.PORT || 3000;

app.use(express.json()) // Define que o express irá receber dados em json

app.use("/usuario", usuarioRota) // Define a rota do usuário
app.use("/auth", authRota)

app.listen(port, () => { // Inicia o servidor
    console.log('A porta está aberta em:', { port })
})  