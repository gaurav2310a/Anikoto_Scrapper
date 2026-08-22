const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const url = (time) =>{
  const main = dayjs(`${time} 00:00:00`).unix();
 return `https://anikototv.to/ajax/schedule/date?tz=-4&time=${main}`
}
 

const headers = {
  "authority": "anikototv.to",
  "accept": "application/json, text/javascript, */*; q=0.01",
  "accept-language": "en-US,en;q=0.8",
  "cache-control": "no-cache",
  "cookie": "country_code=BD",
  "pragma": "no-cache",
  "referer": "https://anikototv.to/home",
  "sec-ch-ua": '"Not:A-Brand";v="99", "Brave";v="145", "Chromium";v="145"',
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"Android"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-gpc": "1",
  "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
  "x-requested-with": "XMLHttpRequest"
};

async function getSchedule(time) {
  try {
    const response = await axios.get(url(time), { headers });
    
    const $ = cheerio.load(response.data.result);

    const schedule = [];

    $('.items .item').each((i, el) => {
      const $el = $(el);
      
      const link = $el.attr('href');
      const time = $el.find('.time').text().trim();
      const episode = $el.find('.ep span').text().trim();
      const title = $el.find('.title').text().trim();
      const titleJp = $el.find('.title').attr('data-jp') || null;

      schedule.push({
        time: time,
        episode: episode,
        title: title,
        titleJapanese: titleJp,
        url: link ? `${link}` : null,
      });
    });

  //  console.dir(schedule, { depth: null });

    return schedule;

  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}


module.exports = getSchedule;