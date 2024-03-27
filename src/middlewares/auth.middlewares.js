import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Parte onde faz a autenticação e autorização do usuário, assim que autorizado, todo o acesso dele será liberado.
export const authMiddlewares = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.send(401);
        }

        const particao = authorization.split(" ");

        if (particao.lenght !== 2) {
            return res.send(401);
        }

        const [schema, token] = particao;

        if (schema !== "Bearer") {
            return res.send(401);
        }

        jwt.verify(token, process.env.CHAVE_JWT, (error, decode) => {
            if (error) {
                return res.send(401);
            }
            console.log(decode);
        });

        next();
    }
    catch (err) {
        res.status(500).send(err.mensagem);
    };
}