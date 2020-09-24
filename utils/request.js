import config from './config.js'

export default function(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    // 发送请求，获取banner数据
    wx.request({
      url: config.host + url,
      data,
      method,
      // 请求成功的回调
      success: (res) => {
        // console.log("222",res.data)
        resolve(res.data)
      }
    })
  })
}