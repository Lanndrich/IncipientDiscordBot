const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();

const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"];

const encouragements = [
  "Maybe if you were just better at stuff and things you wouldn't feel that way. :<",
  "Be well pls. <3",
  "Meow meow meow."
];

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data[0]["q"] + "  - " + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on("message", msg => {
  if (msg.author.bot) return;

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote));
  }

  if (sadWords.some(word => msg.content.includes(word))) {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    msg.reply(encouragement);
  }
})

client.login(process.env.TOKEN);