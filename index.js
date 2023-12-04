const express = require('express') // Importa a biblioteca express
const connectDatabase = require("./src/database/db") // Importa a conexão com o banco de dados
const usuarioRota = require('./src/routes/usuario.route') // Importa a rota do usuário

connectDatabase() // Estabelece a conexão com o banco de dados

const app = express() // Define que o express será utilizado pelo app

app.use(express.json()) // Define que o express irá receber dados em json

app.use("/usuario", usuarioRota) // Define a rota do usuário

app.listen(3000, () => { // Inicia o servidor
    console.log('A porta está aberta em: 3000')
})