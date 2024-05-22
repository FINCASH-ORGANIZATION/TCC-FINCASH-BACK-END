import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import { host, port, user, pass } from '../src/modules/mail.json';

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
    defaultLayout: false,
    partialsDir: path.resolve('../src/modules/mail.json')
  },
  viewPath: path.resolve('../src/modules/mail.json'),
  extName: '.html',
}));

export default transport;