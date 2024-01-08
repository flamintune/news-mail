const { getChmeanByBing: getChmean } = require('./translate')
const { EMAIL_RECEIVER, EMAIL_SENDER } = require('../config/env')
const apis = Object.values(require('./news'))

async function getMailOptions() {
    try {

        const data = await Promise.all(apis.map(api => api()))
        if (!data)
            throw new error('no data')
        const text = data.flat().map(item => (item.title)).join('\n')
        const cn = await getChmean(text)
        const chnMeans = cn.split('\n')
        const mailOptions = {
            from: `notomatoのnews is coming <${EMAIL_SENDER}>`, // 发件人地址
            to: `${EMAIL_RECEIVER}`, // 收件人地址，可以是多个，用逗号分隔
            subject: 'News', // 主题
            template: 'card', // 使用的模板名，无需扩展名，对应views目录中的email.hbs文件
            context: { // 模板中的变量
                articles: data.flat().map((item, idx) => ({ ...item, chnMean: chnMeans[idx] }))
            }
        };
        console.log(mailOptions.context.articles)
        return mailOptions
    } catch (err) {
        console.log("getMailOptions error:", err)
    }

}
getMailOptions()
module.exports = getMailOptions