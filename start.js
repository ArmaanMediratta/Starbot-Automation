var fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});
const puppeteer = require('puppeteer');
const { readFileSync, chmod } = require('fs');
var sleep = require('sleep-promise');
const express = require('express');
const app = express();
const http = require('http');
const locateChrome = require('locate-chrome');
const random_name = require('node-random-name');
const request = require('request-promise-native');
const poll = require('promise-poller').default;
const hook = require('./hook.js');
const axios = require('axios');
const resiRunner = require('./resi.js');
const topUpRunner = require('./topup.js');
const yahooGen = require('./yahoo.js');
const catchall = require('./catchall.js');
const starbucks = require('./starbucks.js');
const mcd = require('./mac.js');
require('events').EventEmitter.defaultMaxListeners = 7;
const API_KEY = 'pk_3FtkSt9Bq6TmlOVpp7dzsiX7vMGyDFJu'/* Your publishable API key here */;


let rawdata = fs.readFileSync('config.json');
let parseData = JSON.parse(rawdata);


const accounts = readFileSync('accounts.txt').toString().replace(/\r\n/g,'\n').split('\n');
const proxies = readFileSync('proxies.txt').toString().replace(/\r\n/g,'\n').split('\n');
let key = JSON.stringify(parseData.key);
let link = JSON.stringify(parseData.link);
let mainKey = key.split('"').join('');
let mainLink = link.split('"').join('');


async function main(){
  const requestListener = function (req, res) {
    res.writeHead(200);
    res.end('What are you doing here starbot user?');
  }  
  var port = Math.round(Math.random() * (8000 - 2000) + 2000);
  const server = http.createServer(requestListener);
  server.listen(port);
  console.log(`
█▀ ▀█▀ ▄▀█ █▀█ █▄▄ █▀█ ▀█▀ █░█
▄█ ░█░ █▀█ █▀▄ █▄█ █▄█ ░█░ ▀▀█`)
  let user = await requestDiscordID(mainKey);
  console.log('\x1b[35m%s\x1b[0m', 'Welcome Back ' + user + '!');
  console.log('\x1b[36m%s\x1b[0m', accounts.length - 1 + ' Accounts loaded');
  console.log('\x1b[36m%s\x1b[0m', proxies.length + ' Proxies loaded');
  console.log('\x1b[36m%s\x1b[0m', '1. Start tasks');
  console.log('\x1b[36m%s\x1b[0m', '2. Code top up');
  console.log('\x1b[36m%s\x1b[0m', '3. Yahoo dispo account gen');
  console.log('\x1b[36m%s\x1b[0m', '4. Catchall gen');
  console.log('\x1b[36m%s\x1b[0m', '5. Settings');
  console.log('\x1b[36m%s\x1b[0m', '6. Test webhook');

  let mode = false
  while(mode === false){
    var input = prompt("Enter here: ")
    if(input == 1){
      if(mainLink == 'https://shell-10year.promo.eprize.com/#/register'){
        resiRunner.main();
        mode = true;
      }
      else if(mainLink === 'https://starbucks.promo.eprize.com/survey/'){
         starbucks.main();
         mode = true;
      }
      else if(mainLink === 'https://www.mcdsartistresidency.com/amoe'){
        mcd.main();
        mode = true;
      }
    }
    else if(input == 2){
      topUpRunner.main();
       mode = true;
    }
    else if(input == 3){
      yahooGen.main();
      mode = true;
    }
    else if(input == 4){
      catchall.main();
      mode = true;
    }
    else if(input == 5){  
      console.log(parseData);
      mode = true;
    }
    else if(input == 6){
      hook.test();
      mode = true;
    }
    else{
      console.log('\x1b[31m%s\x1b[0m', 'Invalid input, try again');
    }
  }
}



async function requestDiscordID(license) {
  const response = await 
      axios.get(`https://api.hyper.co/v4/licenses/${license}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } })
  return await response.data.integrations.discord.username
}




module.exports = {
  main
}



