# Heyper Bot (discord friendly bot)

this is just a simple discord bot. created using discord.js and others libraries 
this bot have some multiple feature like:

1. say hello
2. give a random quotes
3. and this bot can even play the music!

use command `!help` to see what's command you can use


## How to use discord.js?

to use this library is very easy, all you need to do is.. 

**First**, install the library using `node install discord.js --save` in yor project root terminal

**Second**, import your library in your project entry point (ex: index.js or else) 

***this is how to import using es5 module***
```
const Discord = require('discord.js)
```

or 

***you can use es6 when importing the library***
```
import {Client} from 'discord.js
```

**Third**, Create a new client
```
const client = new Client()
```

**And the Last thing**, you can display a message when your bot is connect, reconnect, or disconnect by using this command
```
client.on('ready', () => console.log(`connecting to ${client.user.tag}`)); // when the bot is connect
client.on('reconnecting', () => console.log(`reconecting ${client.user.tag}`)); // when the bot is reconnect
client.on('disconnecting', () => console.log(`disconect ${client.user.tag}`)); // when the bot is disconnect
```

it's so easy right?
so what are you waiting for?? let's make your own bot now!!


Happy coding!! and have a nice day 😎
