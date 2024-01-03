const { translate } = require('bing-translate-api')
const { blockProcess } = require('../utils/utils')

async function getChmeanByBing(text_en) {
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

module.exports = { getChmeanByBing }