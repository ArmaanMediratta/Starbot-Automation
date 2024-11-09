const { getHWID } = require("hwid");
const axios = require("axios");
var fs = require("fs");
const { readFileSync, chmod } = require("fs");
const startRun = require("./start.js");
const API_KEY = ""; /* Your publishable API key here */

let rawdata = fs.readFileSync("config.json");
let parseData = JSON.parse(rawdata);
let key = JSON.stringify(parseData.key);
let mainKey = key.split('"').join("");

function log(content, status) {
  const now = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  if (status === "normal") {
    console.log("\x1b[36m%s\x1b[0m", content);
  } else if (status === "error") {
    console.log("\x1b[31m%s\x1b[0m", content);
  } else if (status === "success") {
    console.log("\x1b[32m%s\x1b[0m", content);
  }
}

async function getLicense(license) {
  return axios
    .get(`https://api.hyper.co/v4/licenses/${license}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    .then((response) => response.data)
    .catch(() => null);
}

async function updateLicense(license, hwid) {
  return axios
    .patch(
      `https://api.hyper.co/v4/licenses/${license}`,
      {
        metadata: { hwid },
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    )
    .then((response) => response.data)
    .catch(() => null);
}

async function checkLicense(license) {
  log("Checking key", "normal");
  const licenseData = await getLicense(license);

  if (!licenseData) return log("Key not found", "error");

  if (!licenseData.user) return log("Key not bound", "error");

  const hwid = await getHWID();

  if (Object.keys(licenseData.metadata).length === 0) {
    const resp = await updateLicense(license, hwid);
  } else if (hwid === licenseData.metadata.hwid) {
    log("Authentication Successful", "success");
    startRun.main();
    return true;
  }
  log("Key is already active", "error");
  return false;
}

async function requestDiscordID(license) {
  const response = await axios.get(
    `https://api.hyper.co/v4/licenses/${license}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  return await response.data.integrations.discord.id;
}

checkLicense(mainKey);
