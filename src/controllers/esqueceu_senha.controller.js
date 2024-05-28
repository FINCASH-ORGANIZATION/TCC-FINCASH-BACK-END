import crypto from 'crypto';
import error from 'console';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import mailer from '../services/mailer.service.js';

const esqueceuSenha = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario incorreto" });
        }

        const senhatoken = Array.from(crypto.randomBytes(6)).map(byte => (byte % 10).toString()).join('');

        const tempoExpiracao = new Date();
        tempoExpiracao.setMinutes(tempoExpiracao.getMinutes() + 5);

        usuario.resetTokenSenha = senhatoken;
        usuario.expiracaoTokenSenha = tempoExpiracao;

        await usuario.save();

        console.log(senhatoken, tempoExpiracao);

        mailer.sendMail({
            from: 'Fin Cash <noreplyfincash@gmail.com>',
            to: email,
            subject: 'Você esqueceu sua senha do Fin Cash?',
            text: `Não se preocupe! Utilize este token e crie sua nova senha: ${senhatoken}`,
        }, (error) => {
            if (error) {
                console.log(error)
                return res.status(400).send({ Mensagem: 'Não foi possível alterar a senha por email!' });
            };

            return res.status(200).send({ Mensagem: 'E-mail enviado com sucesso!' });
        });
    }
    catch (error) {
        res.status(400).send(error.message);
    };
};

const atualizarSenha = async (req, res) => {
    const { email, senhatoken, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email })
            .select('+resetTokenSenha +expiracaoTokenSenha +senha');

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario incorreto" });
        }

        console.log('Token recebido:', senhatoken);
        console.log('Token armazenado:', usuario.resetTokenSenha);

        if (senhatoken !== usuario.resetTokenSenha)
            return res.status(400).send({ Mensagem: 'Token inválido' });

        const tempoExpiracao = new Date();

        if (tempoExpiracao > usuario.expiracaoTokenSenha)
            return res.status(400).send({ error: 'Token expirado. Por favor, gere outro token' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (senhaValida) {
            return res.status(400).send({ Mensagem: 'A nova senha não pode ser igual à senha atual' });
        };

        usuario.senha = senha;

        await usuario.save();

        res.status(200).send({ Mensagem: 'Senha atualizada com sucesso!' });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};

export { esqueceuSenha, atualizarSenha };