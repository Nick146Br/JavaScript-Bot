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
  let tokens = msg.content.split(" ");
	let command = tokens.shift();
	
	if (command.charAt(0) == "!"){
		if (command.substring(1) == 'ping') {
			msg.reply('pong!');
		}
		else if (command.substring(1) == 'join') {
			const { joinVoiceChannel } = require("@discordjs/voice");
			channel = msg.member.voice.channel;

			connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
		}
		else if (command.substring(1) == 'leave') {
			connection.disconnect();
		}
		else if (command.substring(1) == 'ct') {
			channel = msg.channel;
			let channelName = 'food-talk' + cont;
			cont += 1;
			const thread = channel.threads.create({
				name: channelName,
				autoArchiveDuration: 60,
				reason: 'Needed a separate thread for food',
			});
		}
		else if (command.substring(1) == 'dor') {
			const file = require('fs');
			let json = require("./dor.json");

			file.readFile('./dor.json', (err, data) => {
					if (err){
							console.log(err);
					} else {
						let obj = JSON.parse(data);
						channel = msg.channel;

						for (let i = 0; i < obj[0].exercises.length; i++) {
							channel.send(obj[0].exercises[i]);
						}

						let aux = [];

						for (let i = 1; i < obj.length; i++)
							aux.push(obj[i]);
						
						let json = JSON.stringify(aux);
						file.writeFile('./dor.json', json, (err) => {
								console.log(err);
						});
			   }
			});
		}
		else if (command.substring(1) == 'add') {

      let date = new Date();
      let d = String(date.getTime()); 
    
      console.log(d);
            
      d = new Intl.DateTimeFormat('pt-BR', {timeZone: 'America/Sao_Paulo'}).format(d);

      d = String(d);

      console.log(d);
      let today = d.substring(6,10);
      today = today + d.substring(3,5);
      today = today + d.substring(0,2);
      console.log(today);
      
      let json = require("./dor.json");
  
      if(json[json.length-1].date === today){
        json[json.length-1].exercises.push(tokens[0]);
      }
      else{
        json.push({"date": today, "exercises": tokens[0]});
      }

      console.log(json);
      
			json = JSON.stringify(json);
      
			const file = require('fs')
			file.writeFile('./dor.json', json, (err) =>{
				console.log(err);
			});
	
      console.log(json);
		} 
	}
});

// client.on('')

// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier.

client.login(process.env.KURISU_TOKEN);