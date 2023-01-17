const qrcode = require('qrcode-terminal');
var oneLinerJoke = require('one-liner-joke');
const { Client, Location, List, Buttons, MessageMedia, LocalAuth } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log(qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    let word = msg.body.toLowerCase();

    if(word.includes('hi') || word.includes('sasa') || word.includes('hello') || word.includes('mambo')){
        client.sendMessage(msg.from, 'Poa sana.')
        client.sendMessage(msg.from, "I am offline right now. This chat will now be redirected to a chat bot. ");
        let sections = [{title:'Usage Menu',rows:[{title:'My Resume', description: 'View my skills, experience and projects that I have undertaken'},{title:'Location', description: 'Receive my current gps location'}, {title: 'Joke', description: 'Get a random joke to make your day'}, {title: 'Automation', description: 'Automatically post status on my wall'}]}];
        let list = new List('Select an Item to chat with me','@dave',sections,'Chat Procedure','footer');
        client.sendMessage(msg.from, list);
        msg.react('😊');

        setTimeout(function(){
            client.sendMessage(msg.from, "Would you like to chat more? Send yes to receive chat menu");
        }, 60000)

    } else if(word == "location\nreceive my current gps location"){
        msg.reply(new Location(-1.275312, 36.819946, 'Mawa Courts\n20-37 Chambers Road'));
        setTimeout(function(){
            client.sendMessage(msg.from, "Would you like to chat more? Send yes to receive chat menu");
        }, 5000)
    } else if (word.startsWith('!bot')){
        msg.react('👍');
    } else if(word == 'my resume\nview my skills, experience and projects that i have undertaken'){
        const media = MessageMedia.fromFilePath('./David-SoftwareDeveloper-Resume.pdf');
        msg.reply(media);
        setTimeout(function(){
            client.sendMessage(msg.from, "Would you like to chat more? Send yes to receive chat menu");
        }, 5000)
    } else if(word == 'automation\nautomatically post status on my wall'){
        msg.reply("Send me the message to post.(Be kind!)PROCEDURE: Make sure the word starts with !status");
    } else if(word.startsWith('!status')){
        let newStatus = msg.body.split(' ').slice(1).join(' ')
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to *${newStatus}*`);
        setTimeout(function(){
            client.sendMessage(msg.from, "Would you like to chat more? Send yes to receive chat menu");
        }, 60000)
    } else if(word == 'joke\nget a random joke to make your day'){
        var getRandomJoke = oneLinerJoke.getRandomJoke();
        msg.reply(getRandomJoke);
        msg.reply("😂😂😂😂");
        setTimeout(function(){
            client.sendMessage(msg.from, "Would you like to chat more? Send yes to receive chat menu");
        }, 60000)
    } else if(word == 'yes'){
        let sections = [{title:'Usage Menu',rows:[{title:'My Resume', description: 'View my skills, experience and projects that I have undertaken'},{title:'Location', description: 'Receive my current gps location'}, {title: 'Joke', description: 'Get a random joke to make your day'}, {title: 'Automation', description: 'Automatically post status on my wall'}]}];
        let list = new List('Select an Item to chat with me','@dave',sections,'Chat Procedure','footer');
        client.sendMessage(msg.from, list);
    } else if(msg.hasMedia){
        const attachmentData = await msg.downloadMedia();
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
        msg.reply(`
        *Scanning Your Media...*
        *Generated Info*
        MimeType: ${attachmentData.mimetype}
        Filename: ${attachmentData.filename}
        Data (length): ${attachmentData.data.length}
    `);

        msg.reply('Redirecting the safe media...')
        client.sendMessage(msg.from, attachmentData, { caption: 'The data content is safe.' });

    } else {
        const chat = await msg.getChat();
        let sections = [{title:'Usage Menu',rows:[{title:'My Resume', description: 'View my skills, experience and projects that I have undertaken'},{title:'Location', description: 'Receive my current gps location'}, {title: 'Joke', description: 'Get a random joke to make your day'}, {title: 'Automation', description: 'Automatically post status on my wall'}]}];
        let list = new List('Select an Item to chat with my bot','@dave',sections,'Chat Procedure','footer');
        client.sendMessage(msg.from,  "Chat transferred to bot...");
        client.sendMessage(msg.from, list);
    }
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if(ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    console.log('client was logged out', reason);
});

client.initialize();
