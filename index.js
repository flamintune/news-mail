const nodemailer = require("nodemailer")
const { config } = require('dotenv')
config()
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWD = process.env.EMAIL_PASSWD
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT ?? "587")
const transporter = nodemailer.createTransport({
    host: `${EMAIL_HOST}`,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWD,
    }
})


// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // send mail with defined transport object
    console.log('---------------------------------')
    console.log('email send start')
    const info = await transporter.sendMail({
        from: `"Maddison Foo Koch 👻" <${EMAIL_USER}>`, // sender address
        to: `${EMAIL_RECEIVER}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log('email send end')
    console.log('---------------------------------')
}

main().catch(console.error);