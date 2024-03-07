const {WechatyBuilder} = require('wechaty');
const qrcode = require('qrcode-terminal');

class weChaty {
  bot = null

  constructor() {
    this.bot = WechatyBuilder.build();
    this.bot.on('scan', code => {
      qrcode.generate(code, {small: true});
    })
    this.bot.on('message', this.onMessage.bind(this));
    this.shitCount = {}
  }

  async onMessage(message) {
    const room = message.room()
    const name = message.talker().name()
    const roomTopic = await room.topic()
    // 如果是群消息 并且是拉屎群
    if (room && roomTopic == '💩💩') {
      // 如果群消息是💩 ，就对该群成员进行计数+1
      if (message.text() == '💩' || message.text() == '拉屎'){

        if (this.shitCount[name]) {
          this.shitCount[name]++
        } else {
          this.shitCount[name] = 1
        }
        // 通知群成员拉屎成功
        room.say(`@${name} 拉屎+1 你已经拉了${this.shitCount[name]}次屎了`)
      }

      if (message.text() == '统计') {
        const talker = message.talker()
        room.say(`@${name} 你已经拉了${this.shitCount[name]}次屎了`)
      }

      if (message.text() == '比赛结果') {
        const max = Math.max(...Object.values(this.shitCount))
        const winner = Object.keys(this.shitCount).find(key => this.shitCount[key] === max)
        room.say(`本次比赛的冠军是 @${winner}，共拉了${max}次屎`)
      }

      if (message.text() == '重新开始') {
        this.shitCount = {}
        room.say('比赛已经重新开始，大家加油拉屎吧！')
      }
    }
  }

  run() {
    this.bot.start();
  }
}

new weChaty().run();
