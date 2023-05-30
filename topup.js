var fs = require('fs');
var prompt = require('prompt-sync')();
const puppeteer = require('puppeteer-extra');
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
const replace = require("replace");
const { default: RecaptchaPlugin, BuiltinSolutionProviders } = require("puppeteer-extra-plugin-recaptcha");
const CapMonsterProvider = require("puppeteer-extra-plugin-recaptcha-capmonster");

CapMonsterProvider.use(BuiltinSolutionProviders);

const mainAccount = readFileSync('top_account.txt').toString().replace(/\r\n/g,'\n').split('\n');
const codes = readFileSync('codes.txt').toString().replace(/\r\n/g,'\n').split('\n');


let rawdata = fs.readFileSync('config.json');
let parseData = JSON.parse(rawdata);
let capApi = JSON.stringify(parseData.capApi);
let capMode = JSON.stringify(parseData.captchaMode);
let mainCapApi = capApi.split('"').join('');
let mainCapMode = capMode.split('"').join('');
let email = 0;
let password = 0;

puppeteer.use(
	RecaptchaPlugin({
		provider: {
			id: mainCapMode,
			token: mainCapApi // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
		},
		visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
	})
);


for(let i = 0; i < mainAccount.length; i++){
  if(mainAccount[i].includes(':')){
    var curr = mainAccount[i].replace(':',' ');
    var index = curr.indexOf(" "); 
    email = curr.substr(0, index);
    password = curr.substr(index + 1);
  }
}


async function main(){
    const accountIndex = 1;
    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    const browser = await puppeteer.launch({
      headless : true,
      executablePath: executablePath,
      slowMo : 10,
    });
    const page = await browser.newPage();
    await page.waitForTimeout(4500);
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_25.1.1 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/0 WKWebView/1 BytedanceWebview/d8a21c6 FalconTag/');
    await page.goto('https://www.fuelrewards.com/fuelrewards/login-signup.html');
    await sleep(3000)
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering email');
        const emailLog = await page.$('[name="userId"]');
        await emailLog.type(email);
      }catch(e){
        console.log(e)
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing email, stopping');
        browser.close();
      }
      try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex+': Entering password');
        const passwordLog = await page.$('[id="password"]');
        await passwordLog.type(password);
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing password, stopping');
        browser.close();
      }
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Requesting captcha');
      try{
        await page.solveRecaptchas();
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Captcha error, stopping');
        await browser.close();
      }
      await sleep(3000);
      try{
        const loginBut = await page.$('[id="loginButton"]');
        await loginBut.click();
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Logging in');
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error logging in, stopping');
        browser.close();
      }
      console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Logged in');
      await sleep(1500);
      await page.goto('https://www.fuelrewards.com/fuelrewards/reward-code');
      await sleep(3500);
      var counter = 0;
      while(counter < codes.length){
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering code: ' + codes[counter]);
        try{
          const codeEnter = await page.$('[id="promo"]');
          await codeEnter.type(codes[counter]);
          await sleep(450);
          const codeSend = await page.$('[id="promo_send"]');
          await codeSend.click();
          console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Successfully entered code');
          await page.reload();
          await sleep(2500);
          var currentCode = codes[counter];
          replace({
            regex: currentCode,
            replacement: '',
            paths: ['codes.txt'],
            recursive: true,
            silent: true
          });
          counter = counter + 1;
        }catch(e){
          console.log(e);
          console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error sumbitting code');
          await page.reload();
          await sleep(2500);
        }
      }
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Checking account balance');
      await page.goto('https://www.fuelrewards.com/fuelrewards/loggedIn.html');
      await sleep(2500);
      const element = await page.$x('//*[@id="page"]/div[2]/div[11]/div/div[2]/div[1]/ul/span[3]');
      const textObject = await element[0].getProperty('textContent');
      const text = textObject._remoteObject.value;
      let accountBalance = text.substring(1);
      let trueAccountBalance = parseFloat(accountBalance);
      let actAccountBalance = trueAccountBalance + .05
      console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': ' + email + ' balance is $' + actAccountBalance);
      fs.writeFile('codes.txt', '', function(){})
      browser.close();
}




module.exports ={
  main
}








