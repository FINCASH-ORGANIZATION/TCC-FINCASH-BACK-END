import rota from "../routes/auth.route.js"
import bcrypt from 'bcrypt'
import { loginService } from '../services/auth.service.js'


const login = async (req, res) => {
    const { email, senha } = req.body;

    /* Pesquisa no banco de dados para validar se a senha e o usuário estão corretos, caso algum deles esteja incorreto, é exibido a mensagem de 
    erro: "Usuario ou senha incorreto", se os dois estiverem corretos, ira exibir a mensagem dentro dos parenteses do "res.send()". */
    try {
        const usuario = await loginService(email);

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" })
        }

        const senhaisValid = bcrypt.compareSync(senha, usuario.senha);

        if (!senhaisValid) {
            return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" })
        }

        res.send("penis");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

export { login }; 