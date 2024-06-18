import bcrypt from "bcrypt";
import { loginService, geradorToken } from "../services/auth.service.js";

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await loginService(email);

    if (!usuario) {
      return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" });
    }

    const senhaisValid = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaisValid) {
      return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" });
    }

    const token = geradorToken(usuario.id);

    res.send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
};