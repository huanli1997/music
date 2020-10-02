// pages/recommendSong/recommendSong.js
import request from '../../../utils/request.js'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    // 每日推荐
    recommendList: [],
    // 当前歌曲的index
    currentIndex:null

  },

  // 跳转到歌曲详情页面
  toSong(event) {
    let {
      id,
      index
    } = event.currentTarget.dataset;
    this.setData({
      currentIndex:index
    }) 

    // 跳转页面
    wx.navigateTo({
      url: '/songs/pages/song/song?songId=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    // 判断是否登录
    if (!wx.getStorageSync('cookies')) {
      // 说明没有登录
      wx.showModal({
        title: "请先登录",
        content: "该功能需要登录账号",
        cancelText: "回到首页",
        confirmText: "去登录",
        success: (res) => {
          // console.log(res.confirm) 取消 false 确认 true
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else {
            wx.navigateBack()
          }
        }
      })
    }

    // 获取每日推荐列表
    let result = await request("/recommend/songs");
    this.setData({
      recommendList: result.recommend
    })

    // 订阅switchType，获取song页面传递过来的id，判断是需要上一首还是下一首歌
    PubSub.subscribe('switchType', (msg, data) => {
      // 订阅的回调函数,第一个实参是消息名称,第二个实参才是真正发布的数据
      let currentIndex = this.data.currentIndex
      let recommendList = this.data.recommendList
      // 获取到的下一首，下一首的id
      let id
      if (data === 'pre') {
        // 临界值判断
        if (currentIndex === 0) { 
          currentIndex = recommendList.length - 1
        }else{
          // 当前下标减1
          currentIndex--        }
      
      } else if (data === 'next') {      
        currentIndex++
      }
      // 在data中更新最新的currentIndex
      this.setData({
        currentIndex
      })
      id = this.data.recommendList[currentIndex].id
      // 把获取到的id发布给song页面
      PubSub.publish('getMusicID', id)
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