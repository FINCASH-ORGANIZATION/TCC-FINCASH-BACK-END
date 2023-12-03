const express = require('express')
const connectDatabase = require("./src/database/db")
const usuarioRota = require('./src/routes/usuario.route')
const app = express()
const port = 3000

connectDatabase()
app.use(express.json())
app.use("/usuario", usuarioRota)

app.listen(port, () => {
    console.log(`A porta esta aberta em: ${port}`)
});