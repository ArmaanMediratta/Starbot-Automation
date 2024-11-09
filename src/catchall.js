var fs = require("fs");
var prompt = require("prompt-sync")();
const { readFileSync, chmod } = require("fs");
var randomWords = require("random-words");

let rawdata = fs.readFileSync("config.json");
let parseData = JSON.parse(rawdata);
let domain = JSON.stringify(parseData.catchallDomain);
let mainDomain = domain.split('"').join("");

async function main() {
  fs.writeFile("accounts.txt", "", function () {});
  let catchalls = new Array();
  let words = new Array();
  console.log(
    "\x1b[31m%s\x1b[0m",
    "WARNING: Running the gen automatically transfers the catchalls to accounts.txt \nIf you don't want you lose your current accounts make sure to save them before you gen"
  );
  var numGen = prompt("Enter number of catchalls to gen ");
  var counter = 0;

  while (counter < numGen) {
    words = randomWords({ min: 2, max: 2 });
    catchalls.push(words[0] + words[1] + getRandomInt(999) + mainDomain);
    counter = counter + 1;
  }
  console.log("\x1b[32m%s\x1b[0m", "Done, check accounts.txt");
  arrToText(catchalls);
}

async function arrToText(arr) {
  for (let i = 0; i < arr.length; i++) {
    var data = arr[i] + "\n";
    fs.appendFile("accounts.txt", data, "utf8", function (err) {
      if (err) throw err;
    });
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  main,
};
