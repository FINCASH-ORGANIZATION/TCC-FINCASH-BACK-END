const mongoose = require('mongoose');

//RESPONSAVEL PELA CONEXÃO COM O BANCO DE DADOS
const connectDatabase = () => {
    console.log('Esperando a conexão com a database')

    mongoose.connect("mongodb+srv://leonardoborgesphp:teste@fincash.etp41.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log("Banco de dados foi conectado!")).catch((error) => console.log("Banco de dados NÃO conectado"));
};

//EXPORTA A VARIAVEL QUE ARMAZENA A CONEXÃO "connectDatabase" PARA O INDEX.JS, ONDE A MESMA É EXECUTADA
module.exports = connectDatabase;