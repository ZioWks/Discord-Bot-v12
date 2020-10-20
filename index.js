const Discord = require("discord.js");
const { Collection } = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const config = require("./config.json");
 
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.usage = new Discord.Collection();
 
fs.readdir("./commands/", (err, dossiers) => {
     if(err) console.log(err)
     dossiers.forEach((dossier, index) => {
         fs.readdir("./commands/" + dossier +"/", (err, files) => {
 
  if(err) { console.log(err)} else {
  let jsfile = files.filter(f => f.split(".").pop() === "js") 
  if(jsfile.length <= 0) {
        console.log("[LOGS] Il n'y a pas de commande dans le dossier **" + dossier + "**. Veuillez vérifier ceci!");
  } else {
  jsfile.forEach((f, i) => {
      let pull = require("./commands/" + dossier + "/" + f);
      console.log(f + " charger")
      client.commands.set(pull.help.name, pull);  
      pull.help.aliases.forEach(alias => {
          client.aliases.set(alias, pull.help.name)
                });
              });
            }
          }
      });        
    })
  })
 
  client.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;
    
    let prefix = config.prefix;
  
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = message.content.trim().split(/ +/g);
  
  
    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args,prefix)  
})
 
client.on('ready', () => {
    client.user.setPresence({
      status: "offline",
      activity: {
          name: "YOUR STATUS",
          type: "STREAMING" //Choose to STREAMING, PLAYING, WATCHING.
      }
  })
});
 
client.on("message", async message => {
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
})

client.login(config.token);
