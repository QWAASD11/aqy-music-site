/* 阿奇音符 · 网站配置 —— 只改这个文件，不用动其他代码 */

window.AQI_CONFIG = {

  contact: {
    phone: '18723308413',
    phoneDisplay: '187 2330 8413',
    wechat: '',
    hours: '工作日 09:00 — 22:00'
  },

  ark: {
    enabled: true,
    chain: 'BSC（BNB Chain）',
    coin: 'ARK',
    address: '0x6DCdef6AA746c845FBd5ABB7A57838b07f604A01',
    rateText: '',
    qrImage: 'assets/img/pay-ark.png'
  },

  pay: {
    wechatQr: 'assets/img/pay-wechat.png',
    alipayQr: 'assets/img/pay-alipay.png'
  },

  bgm: [
    { name: '阿奇音符 · 背景音乐', src: 'assets/audio/bgm1.mp3' }
  ],

  samples: [
    { name: '生日歌 · 定制示例', style: '流行抒情', src: 'assets/audio/sample1.mp3' }
  ],

  shop: {
    name: '阿奇音符',
    slogan: '把你想说的话，写成一首歌',
    minPrice: 20
  },

  storageKeys: { cart: 'music_cart_v1', orders: 'music_orders_v1' }
};


