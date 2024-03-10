import mongoose from "mongoose";

//RESPONSAVEL PELA CONEXÃO COM O BANCO DE DADOS
const connectDatabase = () => {
    console.log('Esperando a conexão com a database')

    mongoose
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }
        ).then(() => console.log("Banco de dados foi conectado!")).catch((error) => console.log("Banco de dados NÃO conectado"));
};

//EXPORTA A VARIAVEL QUE ARMAZENA A CONEXÃO "connectDatabase" PARA O INDEX.JS, ONDE A MESMA É EXECUTADA
export default connectDatabase;