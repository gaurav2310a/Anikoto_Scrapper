const axios = require('axios');
const cheerio = require('cheerio');

async function getWatchMainDataId(url) {
  try {
    const mainURL = `https://anikototv.to/watch/${url}/ep-1`
    const response = await axios.get(mainURL, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "cookie": "country_code=US"
      }
    });

    const $ = cheerio.load(response.data);

    const dataId = $('#watch-main').attr('data-id');

    if (dataId) {
      //bruh 
      // console.log({
      //   data_id: dataId,
      //   data_url: $('#watch-main').attr('data-url'),
      //   data_ep_name: $('#watch-main').attr('data-ep-name'),
      //   data_ep_type: $('#watch-main').attr('data-ep-type')
      // });

      return dataId;
    } else {
      console.log("Couldn't find any ID");
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}



module.exports = getWatchMainDataId;