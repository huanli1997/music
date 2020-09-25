// pages/song/song.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否在播放
    isPlaying: false,
    // 当前歌曲信息
    songs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // options 可以获取，通过路径传递过来的参数
    const ids = options.songId
    let result = await request('/song/detail', {
      ids
    })
    
    this.setData({
      songs: result.songs
    })

    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: this.data.songs[0].name,
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