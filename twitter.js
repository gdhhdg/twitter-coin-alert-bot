
var twit = require('twit');
var fs = require('fs');
var https = require('https');
var coinData;
var T = new twit ({consumer_key : 'your consumer key',
consumer_secret : 'your consumer secret',
access_token : 'your access token',
access_token_secret : 'your access token secret'
});
var url = "https://api.coinmarketcap.com/v1/ticker/?limit=100";
function getJson()
{
    https.get(url, function(res)
     {
        res.setEncoding("utf8");
    body = "";
    res.on("data", data => {
        body += data;
})
    res.on("end", function ()
     {
         coinData = JSON.parse(body);
        console.log(coinData);
});
});
}
//Get CoinMarketCap json on run and at every 30 minutes. 
getJson();
setInterval(getJson,1000*60*30);//set desired time 


function makeTweet() {
  var i = 0;
  function coinLoop() {
    //setTimeout used to stagger tweets when run to not flood the feed. 
      setTimeout(function () {
          try{
              if (i >= coinData.length){
                  return;//exits when loops through entire JSON
              }
          else if (coinData[i]['percent_change_1h'] >= 5) {
              T.post('statuses/update', {status: coinData[i]["symbol"] + " is up " + coinData[i]['percent_change_1h'] + "% in the past hour. #cryptocurrency #" + coinData[i]["symbol"] + " #" + coinData[i]["name"]}, function (err, data, response) {
                  console.log(data);
               });
              //console.log(coinData[i]["symbol"] + " is up " + coinData[i]['percent_change_1h'] + "% in the past hour. #cryptocurrency #" + coinData[i]["symbol"] + " #" + coinData[i]["name"]);
              i++;
              if (i < coinData.length) {
                  coinLoop();
              }
          }
          else if (coinData[i]['percent_change_1h'] <= -5) {
               T.post('statuses/update',{status:coinData[i]["symbol"] + " is down " + coinData[i]['percent_change_1h'] + "% in the past hour. #cryptocurrency #"+coinData[i]["symbol"] +" #" + coinData[i]["name"]}, function (err, data,response) {
                   console.log(data);
               });
              //console.log(coinData[i]["symbol"] + " is down " + coinData[i]['percent_change_1h'] + "% in the past hour. #cryptocurrency #" + coinData[i]["symbol"] + " #" + coinData[i]["name"]);
              i++;
              if (i < coinData.length) {
                  coinLoop();
              }
          }
          else if (i < coinData.length) {
              i++;
              coinLoop();
          }

      }
      catch(err){
              return;
      }
      },1000*5);//set desired time

  }
  coinLoop();
}
setTimeout(makeTweet,1000*60);//time out set to allow JSON to load
setInterval(makeTweet, 1000*60*31); //tweet function to run after new JSON it retrieved. 
