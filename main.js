//#Import
const dotenv = require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { DynamicLoader, Version } = require('bcdice');
const { Client, GatewayIntentBits, MessageReaction, VoiceState, Guild, User, GuildMember, ActivityType, VoiceStateManager, Embed, EmbedBuilder, Presence, ClientPresence} = require('discord.js');
const { error } = require('console');
const { url } = require('inspector');
const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);
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

//#function

//setActivity
function activeChange(ACname, ACtype) {
  client.user.setPresence({
    activities: [{
      name: ACname,
      type: ActivityType.Playing
    }],
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

//CharacterRoll
function mathStatus(val) {
  var result = 0
  for (let i = 0; i <= (val.length - 1); i++) {
    result = (result + val[i].value)
  }
  return result
}
async function mathDB(STRandSIZ) {
  if (STRandSIZ >= '2' && STRandSIZ <= '12') return "-1D6"
  if (STRandSIZ >= '13' && STRandSIZ <= '16') return "-1D4"
  if (STRandSIZ >= '17' && STRandSIZ <= '24') return "0"
  if (STRandSIZ >= '25' && STRandSIZ <= '32') return "1D4"
  if (STRandSIZ >= '33' && STRandSIZ <= '40') return "1D6"
}

async function charaCreateroll(system) {
  const loader = new DynamicLoader();
  const GameSystem = await loader.dynamicLoad(system);
  var STR = GameSystem.eval('3d6')
  var CON = GameSystem.eval('3d6')
  var POW = GameSystem.eval('3d6')
  var DEX = GameSystem.eval('3d6')
  var APP = GameSystem.eval('3d6')
  var SIZ = GameSystem.eval('2d6+6')
  var INT = GameSystem.eval('2d6+6')
  var EDU = GameSystem.eval('3D6+3')
  STR = mathStatus(STR.detailedRands)
  CON = mathStatus(CON.detailedRands)
  POW = mathStatus(POW.detailedRands)
  DEX = mathStatus(DEX.detailedRands)
  APP = mathStatus(APP.detailedRands)
  SIZ = mathStatus(SIZ.detailedRands)
  INT = mathStatus(INT.detailedRands)
  EDU = mathStatus(EDU.detailedRands)
  var DB = await mathDB(STR+SIZ)

  const result = {
    "STR": STR.toString(),
    "CON": CON.toString(),
    "POW": POW.toString(),
    "DEX": DEX.toString(),
    "APP": APP.toString(),
    "SIZ": SIZ.toString(),
    "INT": INT.toString(),
    "EDU": EDU.toString(),
    "SAN": (POW*5),
    "HP": Math.floor((CON+SIZ)/2+0.6),
    "DB": DB,
    "MP": POW,
    "shokugyoP": (EDU*20).toString(),
    "kyomiP": (INT*20).toString(),
    "all": (STR+CON+POW+DEX+APP+SIZ+INT+EDU)
  }
  return result
}


//embed 

/*
async function embedCreate(AuthorName, AuthorIcon, Title, Color, Description, Url, Timestamp, Fields) {
  const result = new EmbedBuilder()
  .setAuthor({name: AuthorName, iconURL: AuthorIcon})
  .setTitle(Title)
  .setDescription(Description)
  .setFields(Fields)
  .setColor(Color)
  .setURL(Url)
  .setTimestamp(Timestamp)
  .setFooter(null)
  return result
}
*/
/*
client.on('messageCreate', message => {
  if (message.author.bot) return;
  const regWo = /https:\/\/ptb.discord.com\/channels\/\S*/            /*
  if (message.content.match(regWo)) {
    var regUrl = message.content.match(regWo);
    const ftmessage = client.guilds.cache.get(regUrl[0].split("/")[4]).channels.cache.get(regUrl[0].split("/")[5]).messages.fetch(regUrl[0].split("/")[6])
    .then((ftmessage) => {
      var ftembed = embedCreate(ftmessage.author.globalName, ftmessage.author.avatarURL({Boolean: true}), ftmessage.guild.name+"/"+ftmessage.channel.name+"=>", "#404040", ftmessage.content, ftmessage.url, ftmessage.createdTimestamp,[{name: "Reply", value: "?"}])
      try{
      message.reply({embeds: [ftembed]})
      }catch(e) {
        console.error(e)
      }
    })
    .catch((error) => console.error(error))
  }
})
*/  

//characterStatusCreate
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content.match(/^chara/i)) {
    charaCreateroll("Cthulhu")
      .then((result) => {
        if (result.all >= '39' && result.all <= '54') var Color = "#B0B0F0"
        if (result.all >= '55' && result.all <= '69') var Color = "#8080F0"
        if (result.all >= '70' && result.all <= '84') var Color = "#4040F0"
        if (result.all >= '85' && result.all <= '99') var Color = "#0000F0"
        if (result.all >= '100' && result.all <= '114') var Color = "#0000B0"
        if (result.all >= '115' && result.all <= '129') var Color = "#000080"
        if (result.all >= '130' && result.all <= '144') var Color = "#000040"
        const embed = new EmbedBuilder()
          .setTitle('CharacterStatus')
          .setAuthor({name: client.user.username, iconURL: client.user.avatarURL()})
          .setDescription(`HP: ${result.HP} | MP: ${result.MP} | SAN: ${result.SAN}\nDB: ${result.DB}`)
          .addFields(
            {name: "STR / 筋力", value: result.STR},
            {name: "CON / 体力", value: result.CON},
            {name: "POW / 精神力", value: result.POW},
            {name: "DEX / 俊敏性", value: result.DEX},
            {name: "APP / 外見", value: result.APP},
            {name: "SIZ / 体格", value: result.SIZ},
            {name: "INT / 知性", value: result.INT},
            {name: "EDU / 教育", value: result.EDU},
            {name: "職業P / 興味P", value: result.shokugyoP+" / "+result.kyomiP},
            {name: "ステータス合計値(39~144)", value: result.all.toString()}
          )
          .setColor(Color)
          .setTimestamp()
        message.reply({embeds:[embed]})
      }).catch((e) => {
        console.log(e)
      })
  }
})

//DiceRoll
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content.match(/^(coc|coc7|emo|shinobi|futari|para|stell|bc) /i)) {
    if (message.content.match(/^coc /i)) {
      var rollResult = await diceroll("Cthulhu", message.content.slice(4));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^coc7 /i)) {
      var rollResult = await diceroll("Cthulhu7th", message.content.slice(5));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^emo /i)) {
      var rollResult = await diceroll("Emoklore", message.content.slice(4));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^shinobi /i)) {
      var rollResult = await diceroll("ShinobiGami", message.content.slice(8));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^futari /i)) {
      var rollResult = await diceroll("FutariSousa", message.content.slice(7));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^para /i)) {
      var rollResult = await diceroll("Paranoia", message.content.slice(5));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^stell /i)) {
      var rollResult = await diceroll("StellarKnights", message.content.slice(6));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    if (message.content.match(/^bc /i)) {
      var rollResult = await diceroll("DiceBot", message.content.slice(3));
      try {
        message.channel.send(rollResult.text)
      }catch {
        return
      }
    }
    return
  }
  if (message.content.match(/^S?([+\-(]*(\d+|D\d+)|\d+B\d+|\d+T[YZ]\d+|C[+\-(]*\d+|choice|D66|(repeat|rep|x)\d+|\d+R\d+|\d+U\d+|BCDiceVersion)/i)) {
    var rollResult = await diceroll("DiceBot", message.content);
    try {
      message.channel.send(rollResult.text)
    }catch {
      return
    }
  }
});



// ギルド参加通知(一応念のため)
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
client.on('messageCreate', async message => {
  if(message.author.bot) return
  if (!(message.guild.members.cache.get(client.user.id).roles.cache.find(role => role.name == "猫化(ミアBot)"))) {
    message.guild.roles.create({name: "猫化(ミアBot)"})
    .then((e)=> {
      message.guild.members.cache.get(client.user.id).roles.add(e.id)
      return
    })
    .catch((error) => {
      console.error(message.guild.name)
      console.error(error)
      return
    }
  );
  }
  if (message.member.roles.cache.find(role => role.name === "猫化(ミアBot)")) {
    if (message.author.id == '926338244222812250') return;
    if (!(message.content.match(/にゃ(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)?(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)*$/))) {
      if (message.member.permissions.has('Administrator')) {
        message.react('🤔');
        setTimeout(() => {
          message.reactions.cache.get('🤔').users.remove(client.user)
            .catch((error)=>console.error(error))
        }, message.content.length * 1000)
      } else {
        if(message.member.moderatable) {
          try {
          message.member.timeout(message.content.length * 1000)
          console.log(message.author.tag + "さんが猫化してなかったので" + message.content.length + "秒タイムアウトしてきたぞ!!");
          }catch (error) {
            message.channel.send("猫化ロールのついているユーザーをタイムアウトできませんでした。\n↓エラーログ\n```\n"+error+"\n```")
          }
        } else {
          console.log(message.author.tag + "さんが猫化してなかったので" + message.content.length + "秒タイムアウトしようとしたけど無理だった!!");
          message.channel.send(`権限が足りません。<@${client.user.id}> のロールを${message.author.username}の一番上のロールより上にしてください\n`+"```Missing Permissions```")
        }
      }
    }
  }
})


//# Srhf関連
const srhfServer = '1054912983609905203';
const vsNofChannels = '1075485320272941136';
//入室通知
client.on('voiceStateUpdate', (oldState, newState) => {
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
  if (message.content.match(/.*?https:\/\/(www.)?(twitter|x).com\/.*?/i)) {
    if (message.guildId == srhfServer) {
      if (message.channelId == '1054917760813121597') {
        try{
        message.guild.channels.cache.get('1120673022676836352').send("<@" + message.author.id + ">\n" + message.content);
        console.log(message.author.tag + ": \n" + message.content);
        message.delete();
        }catch(error) {
          message.reply("伝送できませんでした。\n```\n"+error+"\n```")
        }
      }
    }
  };
});




//起動処理
client.once('ready', () => {
  console.log("起動完了 MaxeventEmitter:",eventEmitter.getMaxListeners());
  activeChange("起動完了","dnd")
    setInterval(() => {
      activeChange(`${client.guilds.cache.size}Server|${client.ws.ping}Ping(ms)`,"online")
  }, 10000)
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
