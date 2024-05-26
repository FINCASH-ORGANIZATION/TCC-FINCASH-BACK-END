import usuarioService from "../services/Usuario.service.js";

const criarUsu = async (req, res) => {
    try {
        const { nome, senha, email, telefone, avatar } = req.body;
        const Usuario = await usuarioService.criarUsu(req.body)
        //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE;
        //      Erro 400, quando um campo não pode ser processado pelo servidor, erro de digitação do usuário
        if (!nome || !senha || !email) {
            res.status(400).json({ message: "Por favor, preencha todos os campos para se registrar!" })
        };

        //      DEVOLVE A MENSAGEM DE ERRO E STATUS PARA O BANCO E USUARIO
        if (!Usuario) {
            return res.status(400).send({ message: "Erro na criação do usuario" });
        };
        //      DEVOLVE PARA O USUARIO A RESPOSTA COM OS DADOS INSERIDOS E SE FOI REALMENTE CRIADO
        res.status(201).json({
            Mensagem: "Usuario cadastrado com sucesso!",
            Usuario: {
                id: Usuario._id,
                nome,
                email,
                senha,
                telefone,
                avatar
            },
        });
    } catch (error) {
        res.status(400).send(error.message);
    };
};

const pesUsu = async (req, res) => {
    try {
        const Usuarios = await usuarioService.pesUsuService();

        if (Usuarios.lenght === 0) {
            return res.status(400).send({ mensagem: "Não há usuarios cadastrados" })
        };

        res.send(Usuarios);

    } catch (error) {
        res.status(500).send({ message: error.message });
    };
};

const pesUsuId = async (req, res) => { //Function de verificação de usuarios e a Id dos mesmos

    const UsuarioId = req.Usuario; // Faz a requisição do Usuario para o banco de dados

    res.send(UsuarioId); // Faz a Requisição do Usuario ao banco de dados e retorna ao usuario a exibição do nome, email e afins

};

const UsuUpdate = async (req, res) => {
    try {
        const { nome, senha, email, telefone, avatar } = req.body;

        //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE
        if (!nome && !senha && !email && !telefone && !avatar) {
            res.status(400).json({ mensagem: "Por favor, preencha pelo menos um campo para fazer a alteração!" })
        };

        const { id, Usuario } = req;
        await usuarioService.UsuUpdateService(
            id,
            nome,
            senha,
            email,
            telefone,
            avatar
        );

        res.send({ mensagem: "Usuario alterado com sucesso" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    };
};

//exporta os modules, o que cria o usuario no bd, o que pesquisa, o que pesquisa pelo ID e o que faz update
export default {
    criarUsu,
    pesUsu,
    pesUsuId,
    UsuUpdate,
};
