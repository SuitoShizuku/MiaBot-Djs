//require
  //.env
const dotenv = require('dotenv').config();
  //fs & path
const fs = require("fs");
const path = require("path");
  //BCDice
const { DynamicLoader, Version } = require('bcdice');
  //Emitter
const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(12);
  //GET
const { get } = require('http');
  //????
const { error } = require('console');
const { url } = require('inspector');

  //Djs
const { Client, GatewayIntentBits, MessageReaction, VoiceState, Guild, User, GuildMember, ActivityType, VoiceStateManager, Embed, EmbedBuilder, Presence, ClientPresence} = require('discord.js');
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
  //変数系事前処理
const srhfServer = '1054912983609905203';
const vsNofChannels = '1075485320272941136';

//main Function

//function setActivity
function activeChange(ACname, ACtype) {
  client.user.setPresence({
    activities: [{
      name: ACname,
      type: ActivityType.Playng
    }],
    status: ACtype
  })
};
//Srhf
function voiceStateMsg(oldState, newState){
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
}
function TweetUrl(message){
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
}
  //猫化
function catryTypeC(message){
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
          console.log(message.author.tag + "さんが猫化してなかったので" + message.content.length + "秒タイムアウトしようとしたけど無理だった!!" + "userID: "+ message.author.id+ "サーバー名: "+ message.guild.name);
          message.channel.send(`権限が足りません。<@${client.user.id}> のロールを${message.author.username}の一番上のロールより上にしてください\n`+"```Missing Permissions```")
        }
      }
    }
  }
}
function catryTypeU(newMessage){
  if (newMessage.member.roles.cache.find(role => role.name === "猫化(ミアBot)")) {
    if (newMessage.author.id == '926338244222812250') return;
    if (!(newMessage.content.match(/にゃ(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)?(あ|ぁ|-|~|〜|ー|\?|\.|!|,|\/|\(|\)|…|ん)*$/))) {
      if (newMessage.member.permissions.has('Administrator')) {
        newMessage.react('🤔');
        setTimeout(() => {
          newMessage.reactions.cache.get('🤔').users.remove(client.user)
            .catch((error)=>console.error(error))
        }, newMessage.content.length * 1000)
      } else {
        if(newMessage.member.moderatable) {
          try {
          newMessage.member.timeout(newMessage.content.length * 1000)
          console.log(newMessage.author.tag + "さんが猫化してなかったので" + newMessage.content.length + "秒タイムアウトしてきたぞ!!");
          }catch (error) {
            newMessage.channel.send("猫化ロールのついているユーザーをタイムアウトできませんでした。\n↓エラーログ\n```\n"+error+"\n```")
          }
        } else {
          console.log(newMessage.author.tag + "さんが猫化してなかったので" + newMessage.content.length + "秒タイムアウトしようとしたけど無理だった!!");
          newMessage.channel.send(`権限が足りません。<@${client.user.id}> のロールを${newMessage.author.username}の一番上のロールより上にしてください\n`+"```Missing Permissions```")
        }
      }
    }
  }
}

//ヒメかわいい
function himeKawaii(message){
  if(message.content.match(/^(ヒメ|ひめ)$/)) {
    message.reply("かわいい");
    console.log(message.guild.name + "の" + message.channel.name + "チャンネルで" + message.author.tag + "(" + message.member.displayName + ")さんに返事してきたぞ!");
  };
}
//1文字メッセージのみ
function oneMsgOnlyTypeC(message){
  if(message.channel.id == '1146987032829243503') {
    if(message.content.length == '1') {
    } else {
      message.delete();
    }
  }
}
function oneMsgOnlyTypeU(newMessage){
  if (newMessage.guildId == '1112369065688825897') {
    if (newMessage.channelId == '1146987032829243503') {
      if (!(newMessage.content.length == '1')) {
        newMessage.delete().catch(console.error);
      }
    }
  }
}
//ギルド参加通知
function joinGuilds(guild){
  client.guilds.cache.get('1112369065688825897').channels.cache.get('1154887995434991787').send(`# "${guild.name}"サーバーに参加しました。\n### ${guild.description}\n## サーバー情報\nオーナー: <@${guild.ownerId}>\nメンバー数: ${guild.memberCount}\nサーバーアイコン: ${guild.iconURL()}`)
}
function guildsCheck(message){
  if (message.content.match(/^getGuilds/) && message.author.id == '926338244222812250') {
    message.reply(client.guilds.cache.map(guild => guild.name).join("\n"));
  }
}
//DiceRoll
async function nameDice(message){
  if (message.content.match(/^(coc|coc7|emo|shinobi|futari|para|stell|bc) /i)) {
    if (message.content.match(/^coc /i)) {
      var rollResult = await diceroll("Cthulhu", message.content.slice(4));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^coc7 /i)) {
      var rollResult = await diceroll("Cthulhu7th", message.content.slice(5));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^emo /i)) {
      var rollResult = await diceroll("Emoklore", message.content.slice(4));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^shinobi /i)) {
      var rollResult = await diceroll("ShinobiGami", message.content.slice(8));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^futari /i)) {
      var rollResult = await diceroll("FutariSousa", message.content.slice(7));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^para /i)) {
      var rollResult = await diceroll("Paranoia", message.content.slice(5));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^stell /i)) {
      var rollResult = await diceroll("StellarKnights", message.content.slice(6));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    if (message.content.match(/^bc /i)) {
      var rollResult = await diceroll("DiceBot", message.content.slice(3));
      try {
        message.channel.send({embeds:[rollResult]})
      }catch {
        return
      }
    }
    return
  }
  if (message.content.match(/^S?([+\-(]*(\d+|D\d+)|\d+B\d+|\d+T[YZ]\d+|C[+\-(]*\d+|choice|D66|(repeat|rep|x)\d+|\d+R\d+|\d+U\d+|BCDiceVersion)/i) && message.content.match(/d/)) {
    var rollResult = await diceroll("DiceBot", message.content);
    try {
      message.channel.send({embeds:[rollResult]})
    }catch {
      return
    }
  }
}
//キャラステータス作成
function charaStateCreate(message){
  if (message.content.match(/^chara/i)) {
    charaCreateroll("Cthulhu")
      .then((result) => {
        var Color = "#000000"
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
}
//function DiceRoll
async function diceroll(system, roll) {
  const loader = new DynamicLoader();
  const GameSystem = await loader.dynamicLoad(system);
  if (roll == "help") {
    const result = new EmbedBuilder().setTitle(">help").setDescription(GameSystem.HELP_MESSAGE)
    return result
  }else{
    const dice = GameSystem.eval(roll)
    const result = new EmbedBuilder().setDescription(dice.text) 
    return result
  }
}
//function CharacterRoll
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
  var SIZ = GameSystem.eval('2d6')
  var INT = GameSystem.eval('2d6')
  var EDU = GameSystem.eval('3D6')
  STR = mathStatus(STR.detailedRands)
  CON = mathStatus(CON.detailedRands)
  POW = mathStatus(POW.detailedRands)
  DEX = mathStatus(DEX.detailedRands)
  APP = mathStatus(APP.detailedRands)
  SIZ = mathStatus(SIZ.detailedRands)
  INT = mathStatus(INT.detailedRands)
  EDU = mathStatus(EDU.detailedRands)
  var DB = await mathDB(STR+SIZ)
  SIZ = (SIZ + 6)
  INT = (INT + 6)
  EDU = (EDU + 3)
  

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
    "kyomiP": (INT*10).toString(),
    "all": (STR+CON+POW+DEX+APP+SIZ+INT+EDU)
  }
  return result
}
//function 10Puzzle
async function getTen() {
  var Ten
  for(let result ; result == null ; null){
      const loader = new DynamicLoader();
      const GameSystem = await loader.dynamicLoad("DiceBot");
      var a = GameSystem.eval("1d10").detailedRands[0].value
      var b = GameSystem.eval("1d10").detailedRands[0].value
      var c = GameSystem.eval("1d10").detailedRands[0].value
      var d = GameSystem.eval("1d10").detailedRands[0].value
      a = a - 1
      b = b - 1
      c = c - 1
      d = d - 1
      result = makeTen(a, b, c, d)
      Ten = {"Ten":result, "Que":a.toString()+b.toString()+c.toString()+d.toString()}
  }
  return Ten
}
function makeTen(a, b, c, d) {
const nums = [a, b, c, d];
const ops = ['+', '-', '*', '/'];

function calc(op, x, y) {
  if (op === '+') return x + y;
  if (op === '-') return x - y;
  if (op === '*') return x * y;
  if (op === '/') return x / y;
}

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if (j === i) continue;
    for (let k = 0; k < 4; k++) {
      if (k === i || k === j) continue;
      for (let l = 0; l < 4; l++) {
        if (l === i || l === j || l === k) continue;
        for (const op1 of ops) {
          for (const op2 of ops) {
            for (const op3 of ops) {
              const results = [
                calc(op1, nums[i], calc(op2, nums[j], calc(op3, nums[k], nums[l]))),
                calc(op1, nums[i], calc(op3, calc(op2, nums[j], nums[k]), nums[l])),
                calc(op3, calc(op1, nums[i], nums[j]), calc(op2, nums[k], nums[l])),
                calc(op2, calc(op1, nums[i], nums[j]), calc(op3, nums[k], nums[l])),
                calc(op3, calc(op1, nums[i], nums[j]), calc(op2, nums[k], nums[l])),
                calc(op3, calc(op2, calc(op1, nums[i], nums[j]), nums[k]), nums[l]),
              ];

              for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
                if (Math.abs(results[resultIndex] - 10) < 1e-9) {
                  switch (resultIndex) {
                    case 0:
                      return `${nums[i]} ${op1} (${nums[j]} ${op2} (${nums[k]} ${op3} ${nums[l]}))`;
                    case 1:
                      return `${nums[i]} ${op1} ((${nums[j]} ${op2} ${nums[k]}) ${op3} ${nums[l]})`;
                    case 2:
                      return `(${nums[i]} ${op1} ${nums[j]}) ${op3} (${nums[k]} ${op2} ${nums[l]})`;
                    case 3:
                      return `(${nums[i]} ${op1} ${nums[j]}) ${op2} (${nums[k]} ${op3} ${nums[l]})`;
                    case 4:
                      return `(${nums[i]} ${op1} ${nums[j]}) ${op3} (${nums[k]} ${op2} ${nums[l]})`;
                    case 5:
                      return `((${nums[i]} ${op1} ${nums[j]}) ${op2} ${nums[k]}) ${op3} ${nums[l]}`;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

return null;
}

//10Puzzle
function tenPuzzle(message){
  if (message.author.bot || !(message.content.match(/^TenPzl/i))) return;
  getTen().then(v => message.channel.send(`問題: ${v.Que}\n回答: ||${v.Ten}||`))
}



//
//event
//
//* 起動して最初の１回きりの処理
client.once('ready', () => {
  readyProcess()//起動処理
});
//* メッセージが作成された時
client.on('messageCreate', async message => {
  if(message.author.bot) return;//Botスルー
  endMsg(message)//終止処理
  TweetUrl(message)//ツイート転送
  himeKawaii(message)//ヒメかわいい
  oneMsgOnlyTypeC(message)//1文字メッセージのみ
  guildsCheck(message)
  tenPuzzle(message)//10puzzle
  await catryTypeC(message);//猫化
  await nameDice(message);//ダイスロール
  await charaStateCreate(message);//キャラステ作成
})
//* メッセージの更新
client.on('messageUpdate', async (oldMessage, newMessage) => {
  catryTypeU(newMessage)//猫化
  oneMsgOnlyTypeU(newMessage)//1文字メッセージのみ
})
//* ボイスチャンネルの更新
client.on('voiceStateUpdate', async (oldState, newState) => {
  voiceStateMsg(oldState, newState)//ボイチャステータス通知
});
//* ギルドに参加した時
client.on('guildCreate', async guild => {
  joinGuilds(guild)//ギルド参加通知
})




//load
  //起動処理
function readyProcess(){
  console.log("起動完了 MaxeventEmitter:", eventEmitter.getMaxListeners());
  activeChange("起動完了", "dnd")
  setInterval(() => {
    activeChange(`${client.guilds.cache.size}Server|${client.ws.ping}Ping(ms)`, "online")
  }, 10000)
}

  //終止処理
function endMsg(message){
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
}

//run
client.login(process.env.TOKEN);
