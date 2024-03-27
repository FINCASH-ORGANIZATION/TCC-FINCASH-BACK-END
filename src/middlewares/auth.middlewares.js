import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UsuarioService from "../services/Usuario.service.js";

dotenv.config();

// Parte onde faz a autenticação e autorização do usuário, assim que autorizado, todo o acesso dele será liberado.
export const authMiddlewares = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const particao = authorization.split(" ");

        if (particao.length !== 2) {
            return res.sendStatus(401);
        }

        const [schema, token] = particao;

        if (schema !== "Bearer") {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.CHAVE_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ mensagem: "Token Inválido!" });
            }

            const Usuario = await UsuarioService.findByIdUsuarioService(decoded.id);

            if (!Usuario || !Usuario.id) {
                return res.status(401).send({ mensagem: "Token Inválido!" })
            }

            req.UsuarioId = decoded.id;
        });

        next();
    }
    catch (err) {
        res.status(500).send(err.mensagem);
    };
}