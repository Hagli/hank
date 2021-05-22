const Discord = require('discord.js');
const client = new Discord.Client();
//playing with the json file kekvv
const fs = require('fs');
//import config
var config = require('./config.json');
//imports funcs from the said module
/*structure of config {
userID,botID,tokenID,prefix(prefix for calling commands through discord),
name,quote,HNK_date_count(for daily events),
HNK_data_type(daily events sends a file of this type),act,act_obj
}*/
const funcs_and_procs = require('./functions_and_procedures.js');
const token = require('./token.json');//has the channelID that the bot is part of

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    console.log(config.quote);
    client.user.setActivity(config.act_obj, {type : config.act});
    //console.log(client.channels);
    HNK();
});

client.on('message', message => {
    if (message.content.startsWith(`${config.prefix}`)||(message.author.id===config.botID)){
        console.log(`${message.author.username}#${message.author.id} says "${message}" in ${message.channel.name}`);//logs the message, only works properly on text messages
    }//makes it to an if so it only records message with the prefix or things the bot said, as per the request of a friend
    //checks for stuffs in any message
    let search = /PagMan/i;
    if(search.test(message.content)){
        let saburo = client.emojis.cache.find(emoji => emoji.name == 'saburo');
        message.react(saburo.id);
    }
    search = /saburo/i;
    if(search.test(message.content)){
        let pagman = client.emojis.cache.find(emoji => emoji.name == 'PagMan');
        message.react(pagman.id);
    }
    //splits  command to things that only 'I' can do
    if (message.author.id===config.userID){
        switch(true){//all variation of what would happen at certain prefix calls
            //~runtime returns the runtime of the both
            case (message.content === (`${config.prefix}uptime`)):
                msg = funcs_and_procs.time_count(client.uptime);//formatting the "second" variable
                message.channel.send(`I've been running for ${msg}. Now leave me alone!`);
                break;
            //~status -> change status
            case (message.content.startsWith(`${config.prefix}status`)):
                msg = message.content.slice(8);
                switch (true){//for ~status {checks} {stuffs} will change status to that
                    case(msg.startsWith('playing')):
                        msg = msg.slice(8);
                        client.user.setActivity(msg, {type : 'PLAYING'});
                        config.act = 'PLAYING';
                        break;
                    case(msg.startsWith('streaming')):
                        msg = msg.slice(10);
                        client.user.setActivity(msg, {type : 'STREAMING'});
                        config.act = 'STREAMING';
                        break;
                    case(msg.startsWith('listening')):
                        msg = msg.slice(10);
                        client.user.setActivity(msg, {type : 'LISTENING'});
                        config.act = 'LISTENING';
                        break;
                    case(msg.startsWith('watching')):
                        msg = msg.slice(9);
                        client.user.setActivity(msg, {type : 'WATCHING'});
                        config.act = 'WATCHING';
                        break;
                    case(msg.startsWith('competing')):
                        msg = msg.slice(10);
                        client.user.setActivity(msg, {type : 'COMPETING'});
                        config.act = 'COMPETING';
                        break;
                    default://default choice
                        client.user.setActivity('default dance', {type : 'PLAYING'});
                        config.act = 'PLAYING';
                        config.act_obj = 'default dance';
                        break;
                }
                config.act_obj = msg;//change the activity object
                //updating json, self-reminder to perhaps change this into it's own function
                fs.writeFile('./config.json', JSON.stringify(config), error => {
                    if (error){
                        console.log('Failed updating activity');//if somehow fails updating the JSON
                    }
                    else{
                        console.log(config);//if succeed
                    }
                })
                break;
        }
    }
    //for stuffs everyone can call, but not a bot
    if(!message.author.bot){
        switch(true){//all variation of what would happen at certain prefix calls
            //~echo {message} -> bot sends a message as {message}
            case (message.content.startsWith(`${config.prefix}echo`)):
                message.delete();//delete 1 message
                var msg = message.content.slice(6);//cuts the "~echo " part
                message.channel.send(msg);
                break;
        }
        search = /\bhank\b/i;
        if(search.test(message.content)&&!(message.content.startsWith(`${config.prefix}echo`))){
            message.channel.send(config.quote1);
        }
        search = new RegExp(config.botID,'i');
        if(search.test(message.content)&&!(message.content.startsWith(`${config.prefix}echo`))){
            message.channel.send(config.quote1);
        }
    }
});

//function to send daily HNK everyday when it's 20:00
//and also works to ping the bot every 1 minute so it doesnt sleep -> funtion somewhat relegated to dont_sleep for better consistency
function HNK(){
    let curDate = new Date();
    let hour = curDate.getHours();
    if (hour == 20){//checks the time
        client.channels.fetch(token.channel_1)
            .then((channel) => channel.send(`Daily Screenshot of Houseki no Kuni #${config.HNK_date_count}`, {files : [`./images/${config.HNK_date_count}${config.HNK_data_type}`]})//sends the message normally
                .then(console.log("Not poiler time"), channel.send(`Daily Screenshot of Houseki no Kuni #${config.HNK_date_count}`, {files : [`./images/SPOILER_${config.HNK_date_count}${config.HNK_data_type}`]})));//sends the message, but in SPOILER
                //the implementation above will always return an error statement first if the we gon send a SPOILER thingy
                //read up on promise (maybe) to try and make a better implementation
        //updating json for screenshot number
        config.HNK_date_count = parseInt(config.HNK_date_count)+1;//add 1 to HNK_date_count
        fs.writeFile('./config.json', JSON.stringify(config), error => {
            if (error){
                console.log('Failed updating HNK_date_count');//if somehow fails updating the JSON
            }
            else{
                console.log(config);//if succeed
            }
        })
    }
}
setInterval(HNK,3600000);//plays HNK() every 1 hour

function dont_sleep(){
    return 0;
}
setInterval(dont_sleep,1000);//plays dont_sleep every second, so the bot doesnt sleep



client.login(config.tokenID);