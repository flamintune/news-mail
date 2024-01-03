const { transporter } = require('./config/config');
const { EMAIL_SENDER, EMAIL_RECEIVER } = require('./config/env')
// Hacker News API 端点
const { getHackerNewsTopStories } = require('./service/hackerNews')
const { getChmeanByBing: getChmean } = require('./service/translate')

async function main() {
    try {
        const stories = await getHackerNewsTopStories()
        if (!stories)
            throw new error("no hackernews")
        const text = stories.map(item => (item.title)).join('\n')
        const cn = await getChmean(text)
        const chnMeans = cn.split('\n')
        const mailOptions = {
            from: `Hacker News <${EMAIL_SENDER}>`, // 发件人地址
            to: `${EMAIL_RECEIVER}`, // 收件人地址，可以是多个，用逗号分隔
            subject: 'News', // 主题
            template: 'card', // 使用的模板名，无需扩展名，对应views目录中的email.hbs文件
            context: { // 模板中的变量
                articles: stories.map((story, idx) => ({ ...story, chnMean: chnMeans[idx] }))
            }
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('send status:', info.response)
    }
    catch (error) {
        console.log(error)
    }
}

main().catch(console.error);