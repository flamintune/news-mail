const { transporter } = require('./config/config');
const getMailOptions = require('./service/index')

async function main() {
    try {
        const mailOptions = await getMailOptions()
        const info = await transporter.sendMail(mailOptions);
        console.log('send status:', info.response)
    }
    catch (error) {
        console.log(error)
    }
}

main().catch(console.error);