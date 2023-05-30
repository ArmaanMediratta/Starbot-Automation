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


async function main(){
    var count = prompt("Enter number of dispo accounts to gen ")
    const accountIndex = 1;
    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    const browser = await puppeteer.launch({
      headless : true,
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
      await page.goto('https://mail.yahoo.com/d/settings/1');
      await sleep(4500);
      let nickName;
      try{
        const element = await page.$(".Q_6Eb4");
        nickName = await page.evaluate(element => element.textContent, element);
      }catch(e){
        console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Nickname not found, stopping');
        console.log(e)
        await sleep(50000)
        await browser.close();
      }
      var counter = 0;
      while(counter < count){
        try{
            var currKeyword = random_name({first : true })
            const add = await page.$('[class="N_dRA"]');
            await add.click();
            console.log('\x1b[36m%s\x1b[0m', "Task" + accountIndex +': Creating account');
            await sleep(300);
            var randomNum = getRandomInt(250);
            const keyword = await page.$('[name="KEYWORD"]');
            await keyword.type(currKeyword + String(randomNum));
            await sleep(600);
            const save = await page.$('[class="P_1EudUu C_ZkbNhI r_P y_Z2hYGcu A_6EqO cvhIH6_T k_w e_dRA D_X M_fTMfj o_v p_R V_M t_C cZ1RN91d_n u_e69 i_N H_6TFj cn_dBP cg_FJ l_Z29WjXl j_n S_n S4_n I_Z29WjXl I3_Z2bdAhD l3_Z2bdIi1 it3_eo6 I0_Z2bdAhD l0_Z2bdIi1 I4_Z2bdAhD l4_Z2bdIi1"]');
            await save.click();
            console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Account made');
            await sleep(385)
            dispoAccounts.push(nickName + '-' + currKeyword + String(randomNum) + '@yahoo.com');
            counter = counter + 1;
        }catch(e){
            console.log('\x1b[31m%s\x1b[0m', "Task" + accountIndex +': Error creating account, stopping');
            await browser.close();
            break;
        }
      }
      arrToText(dispoAccounts);
      console.log('\x1b[32m%s\x1b[0m', "Task" + accountIndex +': Finished accounts, check dispo_accoutns.txt for accounts');
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