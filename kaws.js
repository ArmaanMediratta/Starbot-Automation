var fs = require('fs');
var prompt = require('prompt-sync')();
const puppeteer = require("puppeteer-extra");
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
const { default: RecaptchaPlugin, BuiltinSolutionProviders } = require("puppeteer-extra-plugin-recaptcha");
const CapMonsterProvider = require("puppeteer-extra-plugin-recaptcha-capmonster");
var colors = require('colors/safe');
require('events').EventEmitter.defaultMaxListeners = 7;

CapMonsterProvider.use(BuiltinSolutionProviders);

const accounts = readFileSync('accounts.txt').toString().replace(/\r\n/g,'\n').split('\n');
const proxies = readFileSync('proxies.txt').toString().replace(/\r\n/g,'\n').split('\n');

let rawdata = fs.readFileSync('config.json');
let parseData = JSON.parse(rawdata);
let capApi = JSON.stringify(parseData.capApi);
let link = JSON.stringify(parseData.link);
let capMode = JSON.stringify(parseData.captchaMode);
let mainLink = link.split('"').join('');
let mainCapApi = capApi.split('"').join('');
let mainCapMode = capMode.split('"').join('');
process.setMaxListeners(15);

let address = new Array();

puppeteer.use(
  RecaptchaPlugin({
      provider: {
          id: mainCapMode,
          token: mainCapApi // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

const browserNames = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36', 
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36', 
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12.5; rv:103.0) Gecko/20100101 Firefox/103.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:103.0) Gecko/20100101 Firefox/103.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/103.0 Mobile/15E148 Safari/605.1.15',
  'Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/103.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/104.0.5112.88 Mobile/15E148 Safari/604.',
  'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.69 Mobile Safari/537.3',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
];


main();

async function main(){
  for(let i = 0; i < accounts.length; i++){
      if(accounts[i].includes("@")){
          runner(i);
          await taskSleep(8000);
      }
      else{}
  }
}

async function runner(accountIndex){
  for(let j = 0; j < proxies.length; j++){
    var currAcc = accounts[accountIndex];
    accountIndex = accountIndex + 1;
    shuffle(proxies);
    let curr = proxies[j];
    var spaces = curr.replace(/:/g, ' ');
    var proxyTemp = spaces.split(" ");
    var ip = (proxyTemp[0]);
    var port = (proxyTemp[1]);
    var proxyUser = (proxyTemp[2]);
    var proxyPass = (proxyTemp[3]);
    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    const browser = await puppeteer.launch({
      headless : true,
      executablePath: executablePath,
      slowMo : 35,
      args: [
        '--proxy-server=' + ip + ':' + port,
        '--proxy-bypass-list=<-loopback>'
      ],
  });
    const page = await browser.newPage();
    var index = Math.floor(Math.random() * 12);
    let browserVal = browserNames[index];
    await page.setUserAgent(browserVal);
    await page.setViewport({ width: 1980, height: 1080 });
    await page.waitForTimeout(2000);
    console.log('\x1b[36m%s\x1b[0m', 'Task' + accountIndex +  ': Setting proxy');
    try{
      await page.authenticate({
        username: proxyUser,
        password: proxyPass,
    });
    }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Proxy error, stopping');
      await browser.close();
      break;
    }
    async function solvCap(){
      log('Requesting captcha', accountIndex);
      await page.solveRecaptchas();
      logSuccess('Got captcha', accountIndex)
    }
    await page.setRequestInterception(true);
    page.on('request', (req) =>{
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      }
      else{
          req.continue();
      }
  })
  try{
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Going to homepage');
      await page.goto(mainLink, {waitUntil: "domcontentloaded"});
  }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error going to homepage, stopping');
      await browser.close();
      break;
  }
  await sleep(3000)
  try{
    log('Entering email', accountIndex)
    const email = await page.$('[id="email"]');
    await email.type(currAcc)
    await sleep(1500);
    const getStarted = await page.$('[class="submit"]');
    await getStarted.click();
    await sleep(2500);
  }catch(e){
    logError('Error entering email, stopping', accountIndex);
    await browser.close();
    break;
  }
  // try{
  //   solvCap();
  // }catch(e){
  //   logError('Error with captcha', accountIndex);
  //   await browser.close();
  //   break;
  // }
  try{
    log('Enter Names', accountIndex)
    const first = await page.$('[id="first_name"]');
    await first.type(random_name({ first: true }));
    const last = await page.$('[id="last_name"]');
    await last.type(random_name({ last: true }));
    const emailA = await page.$('[id="email_2"]');
    await emailA.type(currAcc);
    await sleep(500);
  }catch(e){
    logError('Error entering names, stopping', accountIndex);
    await browser.close();
    break;
  }
  try{
    log('Entering age', accountIndex)
    var ages = ['18-25', '26-INF']
    shuffle(ages);
    await page.select('select[name="age"]', ages[0]);
  }catch(e){
    console.log(e);
    logError('Error entering age, stopping', accountIndex);
    await browser.close();
    break;
  }
  try{
    log('Entering Address Details', accountIndex)
    getRandomAddress(async function(result){
      try{
        address = result;
        // // const cityBoi = await page.$('[id="city"]');
        // // await cityBoi.type(city);
        // // await sleep(500)
        // // await page.select('select[name="state"]', `US-${state}`);
        // // await sleep(500);
        // // const zip = await page.$('[id="zip"]');
        // // await zip.type(zipCode);
      }catch(e){
        console.log(e);
        logError('Error entering address details, stopping', accountIndex);
        await browser.close();
      }
      console.log('moved on')
      try{
        page.waitForNavigation( { waitUntil: 'networkidle0' } ),
        page.waitForNavigation( { waitUntil: 'load' } )
        const addy = await page.$('[id="address1"]');
        await addy.type('hello');
        await sleep(750);
      }catch(e){
        console.log(e)
      }

    })
    var city = address[1];
    const cityBoi = await page.$('[id="city"]');
    await cityBoi.type(city);

  }catch(e){
    logError('Error entering address details, stopping', accountIndex);
    await browser.close();
    break;
  }


  await sleep(1000);
  try{
    log('Submitting entry', accountIndex);
    const rules = await page.$('[names="rules"]');
    await rules.click();
    await sleep(750);
    const cont = await page.$('[title="CONTINUE"]');
    await cont.click();
  }catch(e){
    logError('Error submitting entry, stopping', accountIndex);
    await browser.close();
    break;
  }
  break;


  }

}




















async function getRandomAddress(callback){
  var temp = new Array();
  axios.get("https://random-data-api.com/api/v2/addresses?us=true")
    .then(res =>{
        var address = JSON.stringify(res.data.street_address)
        var city = JSON.stringify(res.data.city)
        var zipCode = JSON.stringify(res.data.zip_code)
        var state = JSON.stringify(res.data.state_abbr)
        temp.push(address.split('"').join(''))
        temp.push(city.split('"').join(''))
        temp.push(zipCode.split('"').join(''))
        temp.push(state.split('"').join(''));
        callback(temp)
  })
}






  async function taskSleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
    
async function shuffle(arr){
    let currIndex = arr.length, randomIndex;
    while(currIndex != 0){
        randomIndex = Math.floor(Math.random() * currIndex);
        currIndex--;
        [arr[currIndex], arr[randomIndex]] = [arr[randomIndex], arr[currIndex]];
    }
    return arr;
} 


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function logSuccess(message, index){
    console.log(colors.green("Task" + index + ": " + message));
}

async function log(message, index){
    console.log(colors.cyan("Task" + index + ": " + message));
}

async function logError(message, index){
    console.log(colors.red("Task" + index + ": " + message));
}