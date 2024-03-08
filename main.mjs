import {WechatyBuilder} from 'wechaty';
import qrcode from 'qrcode-terminal';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const db = new Low(new JSONFile('db.json'), {
  shiteCount: {
    "yy": 0,
    "yuanli": 0,
  },
  winnerCount: {
    "yy": 0,
    "yuanli": 0,
  }
})

class weChaty {
  bot = null

  constructor() {
    this.bot = WechatyBuilder.build();
    this.bot.on('scan', code => {
      qrcode.generate(code, {small: true});
    })
    this.bot.on('message', this.onMessage.bind(this));
  }

  async onMessage(message) {
    await db.read()
    const {shiteCount,winnerCount} = db.data
    const room = message.room()
    const roomTopic = await room.topic()

    // 如果是群消息 并且是拉屎群
    if (room && roomTopic == '💩💩') {
      const name = message.talker().name()
      // 如果群消息是💩 ，就对该群成员进行计数+1 并修改 db.json 文件
      if (message.text() == '💩' || message.text() == '拉屎'){
        if (shiteCount[name]) {
          shiteCount[name]++
        } else {
          shiteCount[name] = 1
        }
        room.say(`@${name} 你已经拉了${shiteCount[name]}次屎了`)
      }

      if (message.text() == '统计') {
        room.say(`@${name} 你已经拉了${shiteCount[name]}次屎了`)
      }

      if (message.text() == '结束') {
        const max = Math.max(...Object.values(shitCount))
        const winner = Object.keys(shiteCount).find(key => shiteCount[key] === max)
        if (winnerCount[winner]) {
          winnerCount[winner]++
        } else {
          winnerCount[winner] = 1
        }
        room.say(`本次比赛的冠军是 @${winner}，共拉了${max}次屎`)
      }

      if (message.text() == '重赛') {
        db.data.shiteCount = {
          "yy": 0,
          "yuanli": 0,
        }
        room.say('比赛已经重新开始，大家加油拉屎吧！')
      }

      if(message.text() == '历史') {
        room.say(`yy: ${winnerCount['yy']}次, yuanli: ${winnerCount['yuanli']}次`)
      }

      if(message.text() == '全部清零') {
        db.data.shiteCount = {
          "yy": 0,
          "yuanli": 0,
        }
        db.data.winnerCount = {
          "yy": 0,
          "yuanli": 0,
        }
        room.say('已经清零')
      }

      if(message.text() == '帮助') {
        room.say('拉屎: 计数+1\n统计: 查看自己的拉屎次数\n结束: 结束本次比赛\n重赛: 重新开始比赛\n历史: 查看历史冠军次数\n全部清零: 清零所有数据')
      }
    }

    await db.write()
  }

  run() {
    this.bot.start();
  }
}

new weChaty().run();
