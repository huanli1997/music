import config from './config.js'

export default function(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    // 发送请求，获取banner数据
    wx.request({
      url: config.host + url,
      data,
      method,
      // 设置请求头
      header: {
        cookie: JSON.parse(wx.getStorageSync("cookies") || "[]").toString()
      },
      // 请求成功的回调
      success: (res) => {
        if (data.isLogin) {
          // 将cookies保存到storage
          let cookies = res.cookies;
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(cookies),
          })
        }
        resolve(res.data)
      }
    })
  })
}