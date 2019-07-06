const ShortUrl = require("./schemas/ShortUrl");
const Settings = require("./schemas/Settings");

const urlManager = () => {
  let current = 0;
  let max = 2 ** 16;
  let coprime = 7931;

  Settings.findOne()
    .then(settings => {
      if (settings) {
        console.log(`Settings found ${settings}`);
        current = settings.current;
        max = settings.max;
        coprime = settings.coprime;
      } else {
        const settings = new Settings({
          current, max, coprime
        })
        settings.save()
          .then(console.log("Saved settings"))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))

  const getBase64 = (num) => {
    return Buffer.from([num >> 8, num]).toString('base64').substr(0, 3);
  };
  return {
    setUrl: async (url) => {
      console.log("setUrl called with " + url);
      current = (coprime + current) % max;
      console.log(max, current)
      if (current == 0) throw "Database is Full";
      let b64 = getBase64(current);
      b64 = b64.replace('/', '-');
      b64 = b64.replace('+', '-');
      const shortUrl = new ShortUrl({
        code: b64, url: url
      })
      try{
        await shortUrl.save();
        console.log(`Saved ${b64} as ${url}`);
        const newSettings = {max, coprime, current}
        await Settings.findOneAndUpdate({}, newSettings, { upsert: true, new: true, setDefaultsOnInsert: true, findOneAndUpdate: false})
        console.log(`Settings modified to: ${newSettings}`)
        return b64
      }
      catch(err){
        console.log(err);
      } 


    },

    getUrl: async (ascii) => {
      console.log(ascii);
      let shortUrl;
      shortUrl = await ShortUrl.findOne({ code: ascii }).exec();
      if (shortUrl) {
        console.log(`Found match: ${shortUrl.code} -> ${shortUrl.url}`);
        return shortUrl.url;
      } else {
        return undefined;
      }
    }
  }
}

module.exports = urlManager;