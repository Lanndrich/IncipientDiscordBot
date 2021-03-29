const Database = require("@replit/database");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const keepAlive = require("./server")

const client = new Discord.Client();
const db = new Database()

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data[0]["q"] + "  - " + data[0]["a"];
    });
}

// Event listener triggered upon succesful login.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Event listener triggered upon receiving a message.
client.on('message', msg => {
  // If the message was sent by a user that is a bot, escape.
  if (msg.author.bot) return;

  // If the user asked for a quote, give that user a quote!  CaveJohnsononespls.
  if (msg.content === '!inspire') {
    getQuote().then(quote => msg.channel.send(quote));
  }
});

keepAlive();
client.login(process.env.TOKEN);

  // if (msg.content.startsWith('$new ')) {
  //   let encouragingMessage = msg.content.split('$new ')[1];
  //   updateEncouragements(encouragingMessage);
  //   msg.channel.send('New encouraging message added.');
  // }


// const starterEncouragements = [
//   "Maybe if you were just better at stuff and things you wouldn't feel that way. :<",
//   "Be well pls. <3",
//   "Meow meow meow."
// ];

// db.get('responding').then(value => {
//   if (value == null) {
//     db.set('responding', true);
//   }
// });

// db.get('encouragements').then(encouragements => {
//   if (!encouragements || encouragements.length < 1) {
//     db.set('encouragements', starterEncouragements);
//   }
// });

// function updateEncouragements(encouragingMessage) {
//   db.get('encouragements').then(encouragements => {
//     encouragements.push([encouragingMessage])
//     db.set('encouragements', encouragements)
//   });
// }

// function deleteEncouragement(index) {
//   db.get('encouragements').then(encouragements => {
//     if (encouragements.length > index) {
//       encouragements.splice(index, 1);
//       db.set('encouragements', encouragements);
//     }
//   });
// }