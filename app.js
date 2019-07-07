const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const app = express(); 
const urlManager = require('./urlManager')();
const baseUrl = "localhost:3001"
const mongoose = require('mongoose')
const config = require('./config');

// Logging
app.use(morgan('combined'))

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

// URL Encoded 
app.use(express.urlencoded({ extended: false }));

//Database connection data
const mongooseConnString = config["MONGO_CONNECTION_STRING"]; 
const mongooseDbName = config["MONGO_DB_NAME"]

// Connect to Mongo
mongoose.connect(mongooseConnString + '/' + mongooseDbName, { useNewUrlParser: true })
    .then(console.log("Succesfully connected"))
    .catch(err => console.log(err));


console.log(mongooseConnString + "/" + mongooseDbName); 

app.get('/', (req, res) => {
  res.render("ShortUrl", {url:undefined});
}); 

app.post('/url', async (req, res) => {
  if(!req.body) res.status(400).send('{"error": "No URL"}')
  console.log(req.body);
  let code; 
  try {
    code = await urlManager.setUrl(req.body.url)
    console.log(code)
    res.render("ShortUrl", {url: `${baseUrl}/${code}`}); 
  } catch (error) {
    console.log(error)
    res.status(500).send('{"error":"Could not generate shortcut"}');
    return; 
  }
})

app.get('/:code', async (req, res) => {
  let url = await urlManager.getUrl(req.params.code);
  console.log(url)
  console.log(`Redirecting to ${url}`); 
  if(url){
    if(!url.startsWith('http://'))
      url = "http://" + url
    res.redirect(301, url); 
    return;
  }
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})