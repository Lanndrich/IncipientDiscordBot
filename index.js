const Database = require("@replit/database");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const client = new Discord.Client();
const db = new Database()

const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"];

const starterEncouragements = [
  "Maybe if you were just better at stuff and things you wouldn't feel that way. :<",
  "Be well pls. <3",
  "Meow meow meow."
];

db.get('responding').then(value => {
  if (value == null) {
    db.set('responding', true);
  }
});

db.get('encouragements').then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set('encouragements', starterEncouragements);
  }
});

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data[0]["q"] + "  - " + data[0]["a"];
    });
}

function updateEncouragements(encouragingMessage) {
  db.get('encouragements').then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set('encouragements', encouragements)
  });
}

function deleteEncouragement(index) {
  db.get('encouragements').then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1);
      db.set('encouragements', encouragements);
    }
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return;

  if (msg.content === '$inspire') {
    getQuote().then(quote => msg.channel.send(quote));
  }

  if (msg.content.startsWith('$new ')) {
    let encouragingMessage = msg.content.split('$new ')[1];
    updateEncouragements(encouragingMessage);
    msg.channel.send('New encouraging message added.');
  }

  if (msg.content.startsWith('$del ')) {
    let index = parseInt(msg.content.split('$del ')[1]);
    deleteEncouragement(index);
    msg.channel.send('Encouraging message deleted.');
  }

  if (msg.content.startsWith('$responding ')) {
    value = msg.content.split('$responding ')[1];

    if (value.toLowerCase() == 'true') {
      db.set('responding', true);
      msg.channel.send("Sad word responses on.");
    } else if (value.toLowerCase() == 'false') {
      db.set('responding', false);
      msg.channel.send('Sad word responding off.');
    }
  }

  db.get('responding').then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get('encouragements').then(encos => {
        const enco = encos[Math.floor(Math.random() * encos.length)];
        msg.reply(enco);
      });
    }
  });
});

client.login(process.env.TOKEN);