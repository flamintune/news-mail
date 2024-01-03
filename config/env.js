const { config } = require('dotenv')
config()

module.exports = {
    EMAIL_SENDER: process.env.EMAIL_SENDER,
    EMAIL_PASSWD: process.env.EMAIL_PASSWD,
    EMAIL_RECEIVER: process.env.EMAIL_RECEIVER,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT ?? "587"),

}