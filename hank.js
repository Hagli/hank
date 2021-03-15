const Discord = require('discord.js');
const client = new Discord.Client();
//playing with the json file kekvv
const fs = require('fs');
//import config
var config = require('./config.json');
//imports funcs from the said module
const funcs_and_procs = require('./functions_and_procedures.js');
const token = require('./token.json');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    console.log(config.quote);
    client.user.setActivity(config.act_obj, {type : config.act});
    //console.log(client.channels);
});

client.on('message', message => {
    console.log(`${message.author.username}#${message.author.id} says "${message}" in ${message.channel.name}`);//logs the message, only works properly on text messages
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
                        config.act_obj = msg;
                        break;
                    case(msg.startsWith('streaming')):
                        client.user.setActivity(msg.slice(10), {type : 'STREAMING'});
                        break;
                    case(msg.startsWith('listening')):
                        client.user.setActivity(msg.slice(10), {type : 'LISTENING'});
                        break;
                    case(msg.startsWith('watching')):
                        client.user.setActivity(msg.slice(9), {type : 'WATCHING'});
                        break;
                    case(msg.startsWith('competing')):
                        client.user.setActivity(msg.slice(10), {type : 'COMPETING'});
                        break;
                    default://default choice
                        client.user.setActivity('default dance', {type : 'PLAYING'});
                        break;
                }
                break;
        }
        fs.writeFile('./config.json', JSON.stringify(config), error => {
            if (error){
                console.log('Failed updating activity');//if somehow fails updating the JSON
            }
            else{
                console.log(config);//if succeed
            }
        })
    }
    //for stuffs everyone can call, but not hank itself, to avoid recursion thorugh ~echo
    if(message.author.id!==config.botID){
        switch(true){//all variation of what would happen at certain prefix calls
            //~echo {message} -> bot sends a message as {message}
            case (message.content.startsWith(`${config.prefix}echo`)):
                var msg = message.content.slice(6);//cuts the "~echo " part
                message.channel.send(msg);
                break;
        }
    }
});

//function to send daily HNK everyday when it's 20:00
//and also works to ping the bot every 1 minute so it doesnt sleep
function HNK(){
    let curDate = new Date();
    let time = curDate.getHours() + ":" + curDate.getMinutes();
    if (time == '20:0'){//checks the time
        client.channels.fetch(token.channel_1).then((channel) => channel.send(`Daily Screenshot of Houseki no Kuni #${config.HNK_date_count}`, {files : [`./images/${config.HNK_date_count}${config.HNK_data_type}`]}));//sends the message
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
    console.log(time);
}
setInterval(HNK,60000);//plays HNK() every one minute


client.login(config.tokenID);