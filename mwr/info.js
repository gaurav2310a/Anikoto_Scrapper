const axios = require('axios');
const cheerio = require('cheerio');

async function getWInfo(url) {
  try {
    mainurl = "https://anikototv.to/watch/"+ url +"/ep-1"
    const response = await axios.get(mainurl, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "cookie": "country_code=BD; prefered_server_id=e54; prefered_server_type=sub"
      }
    });

    const $ = cheerio.load(response.data);
    const $wInfo = $('#w-info');

    if ($wInfo.length === 0) {
      throw new Error("#w-info not found");
    }

    // Remove spam paragraph
    $wInfo.find('p').each((i, el) => {
      const text = $(el).text();
      if (text.includes("Indian anime fans") || text.includes("AnimeKai")) {
        $(el).remove();
      }
    });

    const data = {
      title: $wInfo.find('h1.title, .d-title').first().text().trim(),
      titleJapanese: $wInfo.find('h1').attr('data-jp') || 
                     $wInfo.find('.names').text().split(';')[0]?.trim() || null,
      poster: $wInfo.find('.poster img').attr('src'),
      
      synopsis: $wInfo.find('.synopsis .content, .synopsis').text().trim()
                .replace(/\s+/g, ' ')
                .trim(),

      rating: $wInfo.find('.score .value span').first().text().trim() || 
              $wInfo.find('#w-rating').attr('data-score'),

      type: $wInfo.find('.meta div:contains("Type:") span').text().trim(),
      premiered: $wInfo.find('.meta div:contains("Premiered:") span').text().trim(),
      aired: $wInfo.find('.meta div:contains("Aired:") span').text().trim(),
      status: $wInfo.find('.meta div:contains("Status:") span').text().trim(),
      duration: $wInfo.find('.meta div:contains("Duration:") span').text().trim(),
      episodes: $wInfo.find('.meta div:contains("Episodes:") span').text().trim(),

      genres: [],
      studios: [],
      producers: []
    };

    // Genres
    $wInfo.find('.meta div:contains("Genres:") a').each((i, el) => {
      data.genres.push($(el).text().trim());
    });

    // Studios
    $wInfo.find('.meta div:contains("Studios:") a').each((i, el) => {
      data.studios.push($(el).text().trim());
    });

    // Producers
    $wInfo.find('.meta div:contains("Producers:") a').each((i, el) => {
      data.producers.push($(el).text().trim());
    });


//    console.dir(data, { depth: null });

    return data;

  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
module.exports = getWInfo;