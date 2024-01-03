const { axios } = require('../config/config')

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

module.exports = { getHackerNewsTopStories }