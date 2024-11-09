var fs = require("fs");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const API_KEY = ""; /* Your publishable API key here */
const axios = require("axios");

let rawdata = fs.readFileSync("config.json");
let parseData = JSON.parse(rawdata);
let webhookLink = JSON.stringify(parseData.webhook);
let mainWebHookLink = webhookLink.split('"').join("");
let key = JSON.stringify(parseData.key);
let mainKey = key.split('"').join("");

const hook = new Webhook(mainWebHookLink);
hook.setUsername("Starbot4");

async function success(email, proxy) {
  const embed = new MessageBuilder()
    .setTitle("Winner")
    .setAuthor(
      "Shell",
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png"
    )
    .addField("Account", "||" + email + "||", true)
    .addField("Proxy", "||" + proxy + "||", true)
    .setColor("#00f46a")
    .setFooter(
      "Starbot4 v.017",
      "https://yt3.ggpht.com/yti/AJo0G0mAvc--LjEQykQAptRhe0d9YF-T8ALrlDJA9Cqr=s108-c-k-c0x00ffffff-no-rj"
    )
    .setTimestamp();

  hook.send(embed);
}

async function dunkinSuccess(email, proxy) {
  const embed = new MessageBuilder()
    .setTitle("Winner")
    .setAuthor(
      "Dunkin",
      "https://s3.amazonaws.com/cms.ipressroom.com/285/files/20188/5baa7f2e2cfac254c46e1309_Dunkin+Logo/Dunkin+Logo_3b565e2c-b54c-43c5-b5e1-96184fc02d04-prv.jpg"
    )
    .addField("Account", "||" + email + "||", true)
    .addField("Proxy", "||" + proxy + "||", true)
    .setColor("#00f46a")
    .setFooter(
      "Starbot4 v.017",
      "https://yt3.ggpht.com/yti/AJo0G0mAvc--LjEQykQAptRhe0d9YF-T8ALrlDJA9Cqr=s108-c-k-c0x00ffffff-no-rj"
    )
    .setTimestamp();

  hook.send(embed);
}

async function test() {
  const embed = new MessageBuilder()
    .setTitle("Test")
    .setAuthor(
      "Shell",
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png"
    )
    .addField("Account", "|| rich ||", true)
    .addField("Proxy", "|| jp ||", true)
    .setColor("#9500ff")
    .setFooter(
      "Starbot4 v.017",
      "https://yt3.ggpht.com/yti/AJo0G0mAvc--LjEQykQAptRhe0d9YF-T8ALrlDJA9Cqr=s108-c-k-c0x00ffffff-no-rj"
    )
    .setTimestamp();

  hook.send(embed);
}

const global = new Webhook(
  "https://discord.com/api/webhooks/1005588223914946590/5MmQj5Stkzq6FVhWHg1d3CggFy31P6l68K4v939TVQzdvvnUyjNTyUAWp-jzW5-eKzBW"
);
global.setUsername("Starbot4");

async function globalHook(site, img) {
  var discordID;
  (async () => {
    discordID = await requestDiscordID(mainKey);
    const embed = new MessageBuilder()
      .setTitle("Winner")
      .setAuthor(site, img)
      .setColor("#00f46a")
      .setDescription("User: " + `<@${discordID}>`)
      .setFooter(
        "Global v.017",
        "https://yt3.ggpht.com/yti/AJo0G0mAvc--LjEQykQAptRhe0d9YF-T8ALrlDJA9Cqr=s108-c-k-c0x00ffffff-no-rj"
      )
      .setTimestamp();
    global.send(embed);
  })();
}

async function requestDiscordID(license) {
  const response = await axios.get(
    `https://api.hyper.co/v4/licenses/${license}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  return await response.data.integrations.discord.id;
}

module.exports = {
  success,
  test,
  globalHook,
  dunkinSuccess,
};
