// pages/index/index.js
import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    bannerList: [],
    // 推荐歌曲
    recommendList: [],
    // 排行榜
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 发送请求，获取banner数据
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data:{
    //     type:2
    //   },
    //   // 请求成功的回调
    //   success:(res)=>{
    //     console.log(res.data.banners)
    //     this.setData({
    //       bannerList: res.data.banners
    //     })
    //   }
    // })

    // 封装成函数调用
    // 因为需要等到请求成功了之后才能给 bannerList 设置值，所以要利用promise
    /* 本来可以用await等待请求结果回来，但是await会影响后面的请求，导致请求只能一个一个发，
       同时前面的请求失败，后面的请求也不能发送，所以使用then来等待成功的回调
    */
    // 请求banner
    request("/banner", {
      type: 2
    }).then((res) => {
      // 请求成功
      // console.log("11",res)
      this.setData({
        bannerList: res.banners
      })
    })

    // 请求推荐歌单
    // { limit: 10 } 请求十个歌单
    request("/personalized",{ limit: 10 }).then((res) => {
      this.setData({
        recommendList: res.result
      })
    })

    // 请求排行榜
    // 把需要请求的榜单存入数组
    let arr = [5, 7, 9, 12, 20, 25];
    let index = 0
    // 先定义一个变量topList，等操作完，在赋值给data中的topList，这样就不容易出错
    let topList = []
    while (index < arr.length) {
      // 使用await发送请求，优化页面，因为用户一开始不会看到后面的页面，使用可以一个一个请求
      let res = await request('/top/list', {
        idx: arr[index++]
      });
      let data = {
        name: res.playlist.name,
        /*
          slice:不会影响原数组，左闭右开
          splice：会影响原数组
        */
        tracks: res.playlist.tracks.slice(0, 3)
      }
      topList.push(data)
    }
    // 数据存入topList中
    this.setData({
      topList: topList
    })
  },

  // 跳转到每日推荐页面
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})