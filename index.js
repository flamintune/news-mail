const nodemailer = require("nodemailer")
const { config } = require('dotenv')
const Axios = require('axios');
const tunnel = require('tunnel')
const { create } = require('express-handlebars'); // express-handlebars >= v6.0.0
const path = require('path');
const { translate } = require('bing-translate-api')
config()
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWD = process.env.EMAIL_PASSWD
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT ?? "587")
const agent = tunnel.httpsOverHttp({
    proxy: {
        host: '127.0.0.1',
        port: 7890,
    }
});
const axios = Axios.create({
    httpsAgent: agent,
})
const transporter = nodemailer.createTransport({
    host: `${EMAIL_HOST}`,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWD,
    }
})
// 配置nodemailer-express-handlebars选项
const hbsOptions = {
    viewEngine: create({
        partialsDir: path.resolve('./views/partials'),
        defaultLayout: false,
    }),
    viewPath: path.resolve('./views'),
    extName: '.hbs',
};
// 使用handlebars模板引擎
transporter.use('compile', require('nodemailer-express-handlebars')(hbsOptions));

// Hacker News API 端点
const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const getItemUrl = id => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
async function getHackerNewsTopStories() {
    try {
        // 获取前十个故事的ID
        const storyIdsResponse = await axios.get(topStoriesUrl);
        const storyIds = storyIdsResponse.data.slice(0, 10);

        // 获取每个故事的详细信息
        const storiesPromises = storyIds.map(id => axios.get(getItemUrl(id)));
        const storiesResponses = await Promise.all(storiesPromises);

        // 提取故事数据
        const stories = storiesResponses.map(response => response.data);

        // 打印故事标题和URL
        return stories.map(item => ({ title: item.title, url: item.url, by: item.by }))
    } catch (error) {
        console.error('Error fetching top stories:', error);
    }
}
function blockProcess(milliseconds) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliseconds) { }
}
async function getChmean(text_en) {
    while (1) {
        try {
            const res = await translate(text_en, 'en', 'zh-Hans')
            const translation = res.translation
            return translation
        } catch (err) {
            console.log('getChmean error:', err)
            blockProcess(2000)
        }
    }
}
async function main() {
    try {
        const stories = await getHackerNewsTopStories()
        if (!stories)
            throw new error("no hackernews")
        const text = stories.map(item => (item.title)).join('\n')
        const cn = await getChmean(text)
        const chnMeans = cn.split('\n')
        const mailOptions = {
            from: `Hacker News <${EMAIL_USER}>`, // 发件人地址
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