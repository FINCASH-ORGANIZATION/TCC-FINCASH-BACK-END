import mongoose from "mongoose";

//RESPONSAVEL PELA CONEXÃO COM O BANCO DE DADOS
const connectDatabase = () => {
    console.log('Esperando a conexão com a database')

    mongoose
        // process.env, usado para acessar as variáveis de ambiente, apenas as que existam dentro da aplicação que estamos utilizando
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }
        ).then(() => console.log("Banco de dados foi conectado!")).catch((error) => console.log("Banco de dados NÃO conectado"));
};

//EXPORTA A VARIAVEL QUE ARMAZENA A CONEXÃO "connectDatabase" PARA O INDEX.JS, ONDE A MESMA É EXECUTADA
export default connectDatabase;