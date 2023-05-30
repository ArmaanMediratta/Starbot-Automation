var fs = require('fs');
var prompt = require('prompt-sync')();
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
const replace = require("replace");



const mainAccount = readFileSync('yahoo_account.txt').toString().replace(/\r\n/g,'\n').split('\n');

let user = 0;
let password = 0;
let dispoAccounts = new Array();

for(let i = 0; i < mainAccount.length; i++){
    if(mainAccount[i].includes(':')){
      var curr = mainAccount[i].replace(':',' ');
      var index = curr.indexOf(" "); 
      user = curr.substr(0, index);
      password = curr.substr(index + 1);
    }
}

main();

async function main(){
    var count = prompt("Enter number of dispo accounts to gen ")
    const accountIndex = 1;
    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    const browser = await puppeteer.launch({
      headless : false,
      executablePath: executablePath,
      slowMo : 10,
    });
    const page = await browser.newPage();
    await page.waitForTimeout(4500);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    await page.goto('https://login.yahoo.com/manage_account?.lang=en-US&src=homepage&pspid=2023538075&activity=ybar-signin&signin=true&done=https%3A%2F%2Fwww.yahoo.com%2F&eid=100');
    console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Going to homepage');
    const fs = require('fs')
    fs.writeFile('dispo_accoutns.txt', '', function(){})
    await sleep(1900);
    try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering username');
        const emailLog = await page.$('[name="username"]');
        await emailLog.type(user);
        await sleep(4000)
        await page.keyboard.press('Enter');
        await sleep(10000);
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing user, stopping');
        browser.close();
      }
      try{
        console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Entering password');
        await sleep(4000)
        const passLog = await page.$('[name="password"]');
        await passLog.type(password);
        await page.keyboard.press('Enter');
        await sleep(8000)
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error inputing password, stopping');
        await browser.close();
      }
      console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Going to settings');
      await sleep(10000);
      await page.goto('https://mail.yahoo.com/d/settings/1');
      await sleep(13500);
      try{
        const [getXpath] = await page.$x('//*[@id="mail-app-component"]/div/section/div/article/div/div[1]/div/div[3]/div[5]');
        const getMsg = await page.evaluate(name => name.innerText, getXpath);
        console.log(getMsg)
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Nickname not found, stopping');
        console.log(e)
        await sleep(50000)
        await browser.close();
      }
      await browser.close();
}


async function arrToText(arr){
    for(let i = 0; i < arr.length; i++){
        var data = arr[i] + '\n';
        fs.appendFile('dispo_accoutns.txt', data, 'utf8', 
        function(err) {     
            if (err) throw err;
        });
    }
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


module.exports ={
    main
  }