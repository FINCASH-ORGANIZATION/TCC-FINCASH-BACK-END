import rota from "../routes/auth.route.js"
import bcrypt from 'bcrypt'
import { loginService } from '../services/auth.service.js'


const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await loginService(email);

        const senhaisValid = bcrypt.compareSync(senha, usuario.senha);

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" })
        }

        if (!senhaisValid) {
            return res.status(400).send({ Mensagem: "Usuario ou senha incorreto" })
        }

        res.send("penis");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

export { login }; 