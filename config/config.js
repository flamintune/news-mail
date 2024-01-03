const Axios = require('axios')
const tunnel = require('tunnel')
const nodemailer = require("nodemailer")
const path = require('path')
const { create } = require('express-handlebars'); // express-handlebars >= v6.0.0
const { EMAIL_HOST, EMAIL_PORT, EMAIL_SENDER, EMAIL_PASSWD } = require('./env')

const agent = tunnel.httpsOverHttp({
    proxy: {
        host: '127.0.0.1',
        port: 7890,
    }
});
const axios = Axios.create({
    httpsAgent: agent,
})

const hbsOptions = {
    viewEngine: create({
        partialsDir: path.resolve('./views/partials'),
        defaultLayout: false,
    }),
    viewPath: path.resolve('./views'),
    extName: '.hbs',
};

const transporter = nodemailer.createTransport({
    host: `${EMAIL_HOST}`,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_PASSWD,
    }
})
// 使用handlebars模板引擎
transporter.use('compile', require('nodemailer-express-handlebars')(hbsOptions));

module.exports = { axios, transporter }