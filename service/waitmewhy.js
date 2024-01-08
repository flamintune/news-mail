const { axios } = require('../config/config')
const fs = require('fs')
let Parser = require('rss-parser');
let parser = new Parser();
const feed = 'https://waitbutwhy.com/feed'
const latestTime = 1684870320000;
async function getWaitbutwhyFeed() {
    try {
        let feedData = await parser.parseURL(feed);
        // check time

        const links = feedData.items.filter(item => {
            const time = new Date(item.pubDate).getTime
            if (time >= latestTime) {
                latestTime = time
            }
            return new Date(item.pubDate).getTime() >= latestTime
        }).map(item => ({ link: item.link, title: item.title, author: item["dc:creator"] }))
        return links
    } catch (err) {
        console.log(err)
    }
}


module.exports = { getWaitbutwhyFeed }