const express = require('express')
const app = express()
const cors = require('cors')
const data = require('./mock-data.json');
const { PORT = 3000 } = process.env;
const fs = require('fs');
app.use(cors({
    credentials: true,
}));
app.use(express.static(__dirname+'/public'));

const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;
//get random ad from mock data
const getAd = (type = '') => {
  const ads = type
    ? data.filter(ad => ad.type === type || !ad.success)
    : data;

  const ad = ads[random(0, ads.length)];
  return {
    ...ad,
    id: genAdId()
  }
}

function render(filename, params) {
    var data = fs.readFileSync(filename, 'utf8');
    for (var key in params) {
        data = data.replace('{' + key + '}', params[key]);
    }
    return data;
}

//api endpoint
app.get('/:type', (req, res) => {
    /**
    * type: requested ad type
    */
    res.send(render(__dirname+'/index.html', {
        type: req.params.type
    }));
})
app.get('/database/ads', (req, res) => {
  /**
   * type: requested ad type
   */
  const { type = '' } = req.query;
  res.json(getAd(type.toUpperCase()));
})
app.get('/doc/apiInfo', (req, res) => {
    res.sendFile(__dirname+'/doc/apiInfo.html');
})
app.get('/doc/onlinePlan', (req, res) => {
    res.sendFile(__dirname+'/doc/onlinePlan.html');
})
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}!`)
})
