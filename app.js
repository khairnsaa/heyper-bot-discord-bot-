//importing discord library
const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const {prefix, token, tenortoken} = require('./confing.json')

//create a new client
const client = new Discord.Client();
const queue = new Map();

//display message when bot is online, reconnecting or disconnect
client.on('ready', () => console.log(`connecting to ${client.user.tag}`));
client.on('reconnecting', () => console.log(`reconecting ${client.user.tag}`));
client.on('disconnecting', () => console.log(`disconect ${client.user.tag}`));

//daily quotes
const quotes = [
    'you can do it', 
    'just do it', 
    'stop talking do coding', 
    'just be your self', 
    'everyday is a second chance', 
    'life is strange', 
    'you only life once', 
    'face your fears', 
    'everybody has their own success path']
let number = Math.trunc(Math.random()*5)+1;

//checking new messages
client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const serverQueue = queue.get(msg.guild.id);
    
    //sending a reply when client say something
    if(msg.content.startsWith(`${prefix}hello`)){
        msg.channel.send('hey you')
    } else if(msg.content === '!greetings'){
        msg.channel.send(`i'm just a bot, you can call me hyper. i'll help you as long as i can`)
    } else if(msg.content.startsWith(`${prefix}help`)){
        msg.channel.send(`\nyou can use this command:\n
        !aboutCreator - get to know better about my creator
        !hello - to say hello
        !help - to see bot commands
        !greetings - to introduce the bot
        !play - hard day for you? why don't you listen some music here    
        !quotes - to get a random quotes
        !skip - skip music
        !stop - stop music
        \nhave fun 😎😎
        `)
    } else if(msg.content.startsWith(`${prefix}quotes`)){
        
        if(number === 1){
            msg.channel.send(`here's special quote for you "${quotes[0]}"`)
        } else if(number === 2){
            msg.channel.send(`here's special quote for you "${quotes[1]}"`)
        } else if(number === 3){
            msg.channel.send(`here's special quote for you "${quotes[2]}"`)
        } else if(number === 4){
            msg.channel.send(`here's special quote for you "${quotes[3]}"`)
        } else if(number === 5){
            msg.channel.send(`here's special quote for you "${quotes[4]}"`)
        } else if(number === 6){
            msg.channel.send(`here's special quote for you "${quotes[5]}"`)
        } else if(number === 7){
            msg.channel.send(`here's special quote for you "${quotes[6]}"`)
        } else if(number === 8){
            msg.channel.send(`here's special quote for you "${quotes[7]}"`)
        } else if(number === 9){
            msg.channel.send(`here's special quote for you "${quotes[8]}"`)
        } 
        else if(number === 10){
            msg.channel.send(`here's special quote for you "${quotes[9]}"`)
        }
               
    }  else if (msg.content.startsWith(`${prefix}play`)) {
        execute(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`${prefix}skip`)) {
        skip(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`${prefix}stop`)) {
        stop(msg, serverQueue);
        return;
    } else if(msg.content.startsWith(`${prefix}aboutCreator`)){
        msg.channel.send('her name is khairunnisa, and she made me just for fun')
    }  else {
        msg.channel.send('command is not detected, use !help to see the command you can use');
    }
});

async function execute(msg, serverQueue){
    const args = msg.content.split(" ");

    const voiceChannel = msg.member.voice.channel;

    if(!voiceChannel) return msg.reply('join the voice channel to play the music')
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
    };

    if(!serverQueue){
        const queueContruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
         };

        queue.set(msg.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try {
            let connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(msg.guild, queueContruct.songs[0]);
        } catch(err) {
            console.log(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return msg.channel.send(`${song.title} has been added to the queue!`);
    }

}

//skipping song
function skip (msg, serverQueue){
    if(!msg.member.voice.channel) return msg.reply('join the voice channel to play the music');
    if(!serverQueue) return msg.channel.send(`there's no song that i could skip`);
    serverQueue.connection.dispatcher.end();
}

//stopping song
function stop(msg, serverQueue){
    if (!msg.member.voice.channel) return msg.channel.send("You have to be in a voice channel to stop the music!");
    if (!serverQueue) return msg.channel.send("There is no song that I could stop!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
        
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


//login  the bot using token
client.login(token)
