const mongoose = require('mongoose');

const connectDatabase = () => {
    console.log('Esperando a conexão com a database')

    mongoose.connect("mongodb+srv://leonardoborgesphp:teste@fincash.etp41.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log("Banco de dados conectado")).catch((error) => console.log("Banco de dados NÃO conectado"));
};

module.exports = connectDatabase;