const express = require('express');
const usuarioRota = require('./src/routes/usuario.route');
const app = express();
const port = 3000;

app.use("/soma", usuarioRota);

app.listen(port, () => {
    console.log(`A porta esta aberta em: ${port}`)
});