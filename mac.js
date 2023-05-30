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
const { default: RecaptchaPlugin, BuiltinSolutionProviders } = require("puppeteer-extra-plugin-recaptcha");
const CapMonsterProvider = require("puppeteer-extra-plugin-recaptcha-capmonster");
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
  
  var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  var days = new Array();
  var years = new Array();
  for(let i = 1; i < 32; i++){
    days.push(i);
  }
  var counter = 0;
  for(let j = 0; j < 25; j++){
    years.push(1980 + counter)
    counter = counter + 1;
  }

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: mainCapMode,
            token: mainCapApi // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
);


async function main(){
    for(let i = 0; i < accounts.length - 1; i++){
        runner(i);
        await taskSleep(8000);
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
        slowMo : 20,
        args: [
          '--proxy-server=' + ip + ':' + port,
          '--proxy-bypass-list=<-loopback>',
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
    await sleep(3000);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering first name');
        const firstName = await page.$('[name="data[Sweepuserentry][first_name]"]');
        await firstName.type(random_name({ first: true }));
    }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error entering first name, stopping');
        await browser.close();
        break;
    }
    await sleep(500);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering last name');
        const lastName = await page.$('[name="data[Sweepuserentry][last_name]"]');
        await lastName.type(random_name({ last: true }));
    }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error entering last name, stopping');
        await browser.close();
        break;
    }
    await sleep(500);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering email');
        const email = await page.$('[id="SweepuserentryEmail"]');
        await email.type(currAcc);
        await sleep(500);
        const confoEmail = await page.$('[id="SweepuserentryEmailConfirm"]');
        await confoEmail.type(currAcc);
    }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error entering email, stopping');
        await browser.close();
        break;
    }
    await sleep(500);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering phone number');
        var phoneNumber = getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9) + getRandomInt(9)+ getRandomInt(9)+ getRandomInt(9)+ getRandomInt(9)
        const phone = await page.$('[id="UserfieldField2"]');
        await phone.type(phoneNumber);
    }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error phone number, stopping');
        await browser.close();
        break;
    }
    await sleep(1000);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Adding birthday');
        shuffle(months)
        shuffle(days)
        shuffle(years)
        var month = months[1]
        var day = days[0]
        var year = years[3]
        await page.select('select[name="data[Contact][date][month]"]', String(month));
        await sleep(1000);
        await page.select('select[name="data[Contact][date][day]"]', String(day));
        await sleep(1000);
        await page.select('select[name="data[Contact][date][year]"]', String(year));
        await sleep(1000);
    }catch(e){
        console.log(e)
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error adding birthday, stopping');
        await browser.close();
        break;
    }
    await sleep(500);
    try{
        const TOS = await page.$('[name="data[Sweepuserentry][rules]"]');
        await TOS.click();
    }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error , stopping');
        await browser.close();
        break;
    }
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Requesting captcha');
    try{
       await page.solveRecaptchas();
       await page.waitForTimeout(3500);
      }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error solving captcha, stopping');
      await browser.close();
      break;
    }
    console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Got captcha');
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Submitting entry');
        const submit = await page.$('[data-label="Form-Continue-review"]');
        await submit.click();
        await sleep(5000);
        const extractedText = await page.$eval('*', (el) => el.innerText);
        if(extractedText.includes('Confirmation') && extractedText.includes('received')){
            console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Submitted entry');
        }
        else{console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error submitting entry, stopping');}
        await browser.close();
        break;
    }catch(e){
        console.log(e);
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error submitting entry, stopping');
        await browser.close();
        break;
    }
    break;
 }
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
    return Math.floor(Math.random() * max) + "";
}


    


module.exports = {
    main
}





