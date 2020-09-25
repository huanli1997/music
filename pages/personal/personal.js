// pages/personal/personal.js
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveDistance: 0, // 移动的距离
    moveTransition: "none", // 移动的动画
    // 用户登录信息
    userInfo: {},
    // 最近播放
    playList: null
  },

  // 页面滑动
  handleTouchStart(event) {
    /* 
      event.toucher 记录所有手指的触摸信息
  	  event.changedTouches 记录改变手指的触摸信息
     */
    // console.log(event.changedTouches[0])
    // 手指初始位置，存放到this上
    this.pageY = event.touches[0].pageY
    this.setData({
      moveTransition: "none"
    })
  },

  handleTouchMove(event) {
    // 移动的坐标
    let movePageY = event.touches[0].pageY
    // 移动的差值
    let moveDistance = movePageY - this.pageY
    // 如果 moveDistance 为负数不让往上移动
    if (moveDistance <= 0) return
    // 如果 moveDistance 最大距离为80
    if (moveDistance >= 80) return

    this.setData({
      moveDistance: moveDistance
    })
  },

  /* 当用户松手时,让cover-container组件回到初始位置,并动态添加行内样式transition实现 */
  handleTouchEnd() {
    this.setData({
      moveDistance: 0,
      moveTransition: "transform 0.8s linear"
    })
  },

  // 跳转到登录页面
  toLogin() {
    // 如果用户已有昵称(登陆过才有),就不能跳转login页面
    if (this.data.userInfo.nickname) return

    wx.redirectTo({
      url: '/pages/login/login',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 去storage中读取用户数据
    let userInfoStr = wx.getStorageSync("userInfo")
  
    // 如果有值就设置给data
    if (!this.data.userInfo.nickname && userInfoStr) {
      this.setData({
        userInfo: JSON.parse(userInfoStr)
      })
    }
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: async function () {
    //如果Storage中有用户信息,就获取对应的userId去发送请求,获取用户最近播放记录
    if (this.data.userInfo.nickname){
      let result = await request('/user/record', {
        type: 1,
        uid: this.data.userInfo.userId
      })
      // console.log(result.weekData.slice(0,20))
      this.setData({
        // 数据太多了，只取20条，slice不改变原数组
        playList: result.weekData.slice(0, 20)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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