import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import mailConfig from './mail.json' assert { type: 'json' };

const { host, port, user, pass } = mailConfig;

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

transport.use('compile', hbs({
  viewEngine: {
    extname: '.html',
    layoutsDir: 'src/modules/mail/',
    defaultLayout: null, 
    partialsDir: 'src/modules/mail/',
  },
  viewPath: 'src/modules/mail/',
  extName: '.html'
}));

export default transport;