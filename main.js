//#Import
const dotenv = require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { DynamicLoader, Version } = require('bcdice');
const { Client, GatewayIntentBits, MessageReaction, VoiceState, Guild, User, GuildMember, ActivityType, VoiceStateManager} = require('discord.js');
const client = new Client(
  { intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
    ]
  }
);

//#Function

//setActivity
function activeChange(ACname, ACtype) {
  client.user.setPresence({
    activities:{
      name: ACname
    },
    status: ACtype
  })
};

//DiceRoll
async function diceroll(system, roll) {
  const loader = new DynamicLoader();
  const GameSystem = await loader.dynamicLoad(system);
  const result = GameSystem.eval(roll);
  return result
}




//#Client.on

//DiceRoll
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content.match(/^(coc|coc7|emo|shinobi|futari|para|stell|bc) /i)) {
    if (message.content.match(/^coc /i)) {
      var rollResult = await diceroll("Cthulhu", message.content.slice(4));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^coc7 /i)) {
      var rollResult = await diceroll("Cthulhu7th", message.content.slice(5));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^emo /i)) {
      var rollResult = await diceroll("Emoklore", message.content.slice(4));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^shinobi /i)) {
      var rollResult = await diceroll("ShinobiGami", message.content.slice(8));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^futari /i)) {
      var rollResult = await diceroll("FutariSousa", message.content.slice(7));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^para /i)) {
      var rollResult = await diceroll("Paranoia", message.content.slice(5));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^stell /i)) {
      var rollResult = await diceroll("StellarKnights", message.content.slice(6));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    if (message.content.match(/^bc /i)) {
      var rollResult = await diceroll("DiceBot", message.content.slice(3));
      try {
        message.channel.send(rollResult.text +".")
      }catch {
        return
      }
    }
    return
  }
  if (message.content.match(/^S?([+\-(]*(\d+|D\d+)|\d+B\d+|\d+T[YZ]\d+|C[+\-(]*\d+|choice|D66|(repeat|rep|x)\d+|\d+R\d+|\d+U\d+|BCDiceVersion)/i)) {
    var rollResult = await diceroll("DiceBot", message.content);
    try {
      message.channel.send(rollResult.text +".")
    }catch {
      return
    }
  }
});

client.on('guildCreate', guild => {
  client.guilds.cache.get('1112369065688825897').channels.cache.get('1154887995434991787').send(`# "${guild.name}"サーバーに参加しました。\n### ${guild.description}\n## サーバー情報\nオーナー: <@${guild.ownerId}>\nメンバー数: ${guild.memberCount}\nサーバーアイコン: ${guild.iconURL()}`)
})


//1文字投稿チャンネル
client.on('messageCreate', message => {
  if(message.channel.id == '1146987032829243503') {
    if(message.content.length == '1') {
    } else {
      message.delete();
    }
  }
})
client.on('messageUpdate',(oldMessage,newMessage) => {
  if (newMessage.guildId == '1112369065688825897') {
    if (newMessage.channelId == '1146987032829243503') {
      if (!(newMessage.content.length == '1')) {
        newMessage.delete().catch(console.error);
      }
    }
  }
})

//ヒメかわいい
client.on('messageCreate', message => {
  if(message.author.bot) return;
  if(message.content.match(/^(ヒメ|ひめ)$/)) {
    message.reply("かわいい");
    console.log(message.guild.name + "の" + message.channel.name + "チャンネルで" + message.author.tag + "(" + message.member.displayName + ")さんに返事してきたぞ!");
  };
})

//猫化
client.on('messageCreate', message => {
  if(message.author.bot) return
  if (!(message.guild.members.cache.get(client.user.id).roles.cache.find(role => role.name == "猫化(ミアBot)"))) {
    message.guild.roles.create({name: "猫化(ミアBot)"})
    .then((e)=> {
      message.guild.members.cache.get(client.user.id).roles.add(e.id)
  });
  }
  if (message.member.roles.cache.find(role => role.name === "猫化(ミアBot)")) {
    if (message.author.id == '926338244222812250') return;
    if (!(message.content.match(/にゃ(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)?(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)*$/))) {
      if (message.member.permissions.has('Administrator')) {
        message.react('🤔');
        setTimeout(() => {
          message.reactions.cache.get('🤔').users.remove(client.user)
        }, message.content.length * 1000)
      } else {
        if(message.member.moderatable) {
          message.member.timeout(message.content.length * 1000)
          console.log(message.author.tag + "さんが猫化してなかったので" + message.content.length + "秒タイムアウトしてきたぞ!!");
        } else {
          console.log(message.author.tag + "さんが猫化してなかったので" + message.content.length + "秒タイムアウトしようとしたけど無理だった!!");
          message.channel.send(`権限が足りません。<@${client.user.id}> のロールを${message.author.username}の一番上のロールより上にしてください`)
        }
      }
    }
  }
})


//# Srhf関連
const srhfServer = '1054912983609905203';
const vsNofChannels = '1075485320272941136';
//入室通知
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (oldState === null && newState.guild.id !== srhfServer) return
  if (newState === null && oldState.guild.id !== srhfServer) return
  if (newState !== null && oldState !== null && oldState.guild.id !== srhfServer) return
  if (oldState.channelId === newState.channelId) return
  if (oldState.channelId === null && newState.channelId !== null) { //古いチャンネルが無 新しいチャンネルが有 の場合(join)
    return client.guilds.cache.get(srhfServer).channels.cache.get(vsNofChannels).send(newState.member.user.username + "が <#" + newState.channel.id + "> に入室しました：" + newState.channel.members.size + "人");
  };
  if (oldState.channelId !== null && newState.channelId === null) { //古いチャンネルが有 新しいチャンネルが無 の場合(leave)
    return client.guilds.cache.get(srhfServer).channels.cache.get(vsNofChannels).send(oldState.member.user.username + "が <#" + oldState.channel.id + "> から退出しました：" + oldState.channel.members.size + "人");
  };
  if (oldState.channelId !== null && newState.channelId !== null) { //古いチャンネルが有 新しいチャンネルが有 の場合(move)
    return client.guilds.cache.get(srhfServer).channels.cache.get(vsNofChannels).send(oldState.member.user.username + "が <#" + oldState.channel.id + "> から <#" + newState.channel.id + "> に移動しました：" + oldState.channel.members.size + "人|" + newState.channel.members.size + "人");
  };
});
client.on('messageCreate', message => {
  if (message.content.match(/.*?https:\/\/(www.)?(twitter|x).com\/.*?/)) {
    if (message.guildId == srhfServer) {
      if (message.channelId == '1054917760813121597') {
        message.guild.channels.cache.get('1120673022676836352').send("<@" + message.author.id + ">\n" + message.content);
        console.log(message.author.tag + ": \n" + message.content);
        message.delete();
      }
    }
  };
});



//起動処理
client.once('ready', async () => {
  console.log("起動完了");
  activeChange("起動完了","dnd")
});
client.once('messageCreate', message =>{
  activeChange("なにもないよ","online")
  console.log("起動して最初のメッセージ\n"+message.author.username+":\n"+message.content)
});
//終止処理
client.on('messageCreate', message => {
  if (message.author.id == '926338244222812250') {
    if (message.content == "<@" + client.user.id + "> end") {
      message.channel.send("```md\n#ProcessEnd(1)```")
      console.log('終止します。');
      activeChange("終了中","dnd")
      setTimeout(() => {
        process.exit(1);
      }, 10 * 1000);
    }
  }
});


client.login(process.env.TOKEN);
