import express from 'express'; // Express é um framework de desenvolvimento web que conecta o banco de dados com o Node.js/Servidor
import connectDatabase from "./src/database/db.js"; // Importa a variável que armazena a conexão com banco de dados
import dotenv from "dotenv"; // Bliblioteca "dot.env" do Node.js que habilita o uso de variáveis de ambiente
import usuarioRota from "./src/routes/usuario.route.js";
import authRota from "./src/routes/auth.route.js";
import transacaoRota from "./src/routes/transacao.route.js";
import esqueceuSenhaRota from "./src/routes/esqueceuSenha.route.js";


dotenv.config();
const rota = express.Router();


connectDatabase(); // Estabelece a conexão com o banco de dados

const port = process.env.PORT || 3000;

const app = express(); // Define que o express será utilizado pelo app 

app.use(express.json()); // Define que o express irá receber dados em json
app.use("/usuario", usuarioRota); // Define a rota do usuário
app.use("/auth", authRota); // Define a rota de autenticação do usuario
app.use("/transacao", transacaoRota); // Define a rota da transação
app.use("/senha", esqueceuSenhaRota); // Define a rota da para redefinir a senha

app.listen(port, () => { // Inicia o servidor
    console.log(`A porta está aberta em: ${port}`)
});