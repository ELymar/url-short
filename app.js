const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const app = express();
const urlManager = require('./urlManager')();
const mongoose = require('mongoose')

// Logging
app.use(morgan('combined'))

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

// URL Encoded middleware
app.use(express.urlencoded({ extended: false }));

//Database connection data
const mongooseConnString = process.env["MONGO_CONNECTION_STRING"];
const mongooseDbName = process.env["MONGO_DB_NAME"]
const baseUrl = process.env["BASE_URL"]

// Set up routes and server
const setupServer = () => {
  // Home page
  app.get('/', (req, res) => {
    res.render("ShortUrl", { url: undefined });
  });

  // Generate a short URL
  app.post('/url', async (req, res) => {
    if (!req.body) res.status(400).send({ error: "No URL given" })
    console.log(req.body);
    let code;
    try {
      code = await urlManager.setUrl(req.body.url)
      console.log(code)
      res.render("ShortUrl", { url: `${baseUrl}/${code}` });
      return
    } catch (error) {
      console.log(error)
      res.status(500).send('{"error":"Could not generate shortcut"}');
      return;
    }
  })

  // Redirect to url given a short code
  app.get('/:code', async (req, res) => {
    let url = await urlManager.getUrl(req.params.code);
    console.log(url)
    console.log(`Redirecting to ${url}`);
    // TODO: Better validation for urls
    if (url) {
      if (!url.startsWith('http'))
        url = "http://" + url
      res.redirect(301, url);
      return;
    }
    res.status(404).send("Not found");
  });

  // Listen on given port
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
}

// Connect to Mongo
// TODO: Remove hardcoded "admin" database for authorization
mongoose.connect(mongooseConnString + '/' + mongooseDbName + '?authSource=admin&w=1', {
  useNewUrlParser: true
})
  .then(() => {
    console.log("Succesfully connected. Setting up server...");
    setupServer();
  })
  .catch(err => console.log(err));
