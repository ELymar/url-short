const ShortUrl = require("./schemas/ShortUrl");
const Settings = require("./schemas/Settings");

const urlManager = () => {
  let current = 0;
  let max = 2 ** 16;
  let coprime = 7931;

  // Lazy initialize settings. (Check DB first)
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

  // Get Base64 number for up to 16 bits
  const getBase64 = (num) => {
    return Buffer.from([num >> 8, num]).toString('base64').substr(0, 3);
  };

  // URL Manager object
  return {
    // Given a URL create a shortened version
    setUrl: async (url) => {
      console.log("setUrl called with " + url);
      current = (coprime + current) % max;
      console.log(max, current)

      // New database starts with current of (0 + coprime) %  max
      // If we repeat this, we eventually go all the way around back to 0
      // This means that the database is full (or has one more slot technically)
      if (current == 0) throw "Database is Full";
      let b64 = getBase64(current);

      // Replace URL unfriendly characters with dash and underscore
      b64 = b64.replace('/', '-');
      b64 = b64.replace('+', '_');
      const shortUrl = new ShortUrl({
        code: b64, url: url
      })
      // Insert shortUrl record into database
      try {
        await shortUrl.save();
        console.log(`Saved ${b64} as ${url}`);
        const newSettings = { max, coprime, current }
        await Settings.findOneAndUpdate({}, newSettings, { upsert: true, new: true, setDefaultsOnInsert: true, findOneAndUpdate: false })
        console.log(`Settings modified to: ${newSettings}`)
        return b64
      }
      catch (err) {
        console.log(err);
        process.exit(1);
      }
    },

    getUrl: async (ascii) => {
      console.log(ascii);
      let shortUrl;
      try {
        shortUrl = await ShortUrl.findOne({ code: ascii }).exec();
        if (shortUrl) {
          console.log(`Found match: ${shortUrl.code} -> ${shortUrl.url}`);
          return shortUrl.url;
        } else {
          return undefined;
        }
      } catch (err) {
        console.log(err); 
        process.exit(1);
      }
    }
  }
}

module.exports = urlManager;