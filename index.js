const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const Discord = require('discord.js');
// const adapter { createDiscordJSAdapter } = require('./adapter');
// const client = new Discord.Client();
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"], permissions: ["CREATE_PUBLIC_THREADS"] });
let connection, channel;
let cont = 1;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
  if (msg.content == 'ping') {
	  msg.reply('pong!');
  }
  else if (msg.content == 'join') {
    const { joinVoiceChannel } = require("@discordjs/voice");
		channel = msg.member.voice.channel;

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
  }
	else if (msg.content == 'leave') {
		connection.disconnect();
	}
	else if (msg.content == '.ct') {
		channel = msg.channel;
		let channelName = 'food-talk' + cont;
		cont += 1;
		const thread = channel.threads.create({
			name: channelName,
			autoArchiveDuration: 60,
			reason: 'Needed a separate thread for food',
    });
	}
});


// client.on('')

// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier.

client.login(process.env.KURISU_TOKEN);