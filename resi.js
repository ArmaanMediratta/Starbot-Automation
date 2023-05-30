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
      headless : false,
      executablePath: executablePath,
      slowMo : 35,
      args: [
        '--proxy-server=' + ip + ':' + port,
        '--proxy-bypass-list=<-loopback>',
      ],
  });
    const page = await browser.newPage();
    var index = Math.floor(Math.random() * 12);
    let browserVal = browserNames[index];
    await page.setUserAgent(browserVal);
    await page.waitForTimeout(2000);
    console.log('\x1b[36m%s\x1b[0m', 'Task' + accountIndex +  ': Setting proxy');
    try{
      await page.authenticate({
        username: proxyUser,
        password: proxyPass,
    });
    }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Proxy error, stopping');
      browser.close();
      break;
    }
  try{
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Going to homepage');
    await page.goto(mainLink);
    }catch(e){
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Error going to homepage, stopping');
      await browser.close();
      break;
    }
  await sleep(5000);
  try{
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering first name');
    const firstName = await page.$('[id="first_name"]');
    await firstName.type(random_name({ first: true }));
    await sleep(1500);
  }catch(e){
    console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing first name, stopping');
    await browser.close();
  }
  try{
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex+': Entering last name');
    const lastName = await page.$('[id="last_name"]');
    await lastName.type(random_name({ last: true }));
    await sleep(1500);
  }catch(e){
    console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing last name, stopping');
    await browser.close();
    break;
  }
  try{
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering email');
    const email = await page.$('[id="email"]');
    await email.type(currAcc);
    await sleep(1500);
  }catch(e){
    console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing email, stopping');
    await browser.close();
    break;
  }
  try{
    const TOS = await page.$('[id="rules"]');
    await TOS.click();
    await sleep(1500);
  }catch(e){
    console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing sumbitting TOS, stopping');
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
  try{
      await page.keyboard.press('Enter');
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Got captcha');
      console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Successfully entered');
  }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Cap error, stopping task');
      await browser.close();
      break;
  }
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Checking Status');
    await sleep(5000);
    try{
      const status = await page.$('[class="btn_play_game"]');
      await status.click();
    }catch(e){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Email ineligible');
      browser.close();
      break;
    }
    await sleep(5500);
    const extractedText = await page.$eval('*', (el) => el.innerText);
    await sleep(2000);
    if(extractedText.includes("try") && extractedText.includes("again") && extractedText.includes("week")){
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Not a winner');
      browser.close();
      break;
    }else if(extractedText.includes("reason") && extractedText.includes("celebrate") && extractedText.includes("won")){
      console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Winner');
      hook.success(currAcc, curr);
      hook.globalHook();
      browser.close();
      break;
    }else{
      console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Invalid status, stopping');
      browser.close();
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





module.exports ={
    main
}