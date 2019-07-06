const express = require('express'); 
const morgan = require('morgan');
const app = express(); 
const urlManager = require('./urlManager')();
const baseUrl = "localhost:3001"
const mongoose = require('mongoose')
const config = require('./config');


app.use(morgan('combined'))

const mongooseConnString = config["MONGO_CONNECTION_STRING"]; 
const mongooseDbName = config["MONGO_DB_NAME"]

// Connect to Mongo
mongoose.connect(mongooseConnString + '/' + mongooseDbName, { useNewUrlParser: true })
    .then(console.log("Succesfully connected"))
    .catch(err => console.log(err));


console.log(mongooseConnString + "/" + mongooseDbName); 

app.get('/', (req, res) => {
  res.send("Hello, world!");
}); 

app.post('/url/:url', async (req, res) => {
  if(!req.params) res.status(400).send('{"error": "No URL"}')
  console.log(req.params.url);
  let code; 
  try {
    code = await urlManager.setUrl(req.params.url)
    console.log(code)
    res.send({url: `${baseUrl}/${code}`}); 
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