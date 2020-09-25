// pages/login/login.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
  },

  // 输入账户和密码
  handlechange(event) {
    /* 
      - event.target ->和原生一样，触发对象
      - event.currentTarget ->事件源
     */
    // 利用input的id属性收集数据，收集到的是字符串格式
    // let type = event.target.id

    // 利用自定义属性收集数据，收集到的数据是你传入的格式
    let type = event.target.dataset.phone
    let value = event.detail.value
    if (value.trim()) {
      this.setData({
        [type]: value
      })
    }
  },

  // 登录按钮
  async handleLogin() {
    // 1.收集数据
    let {
      phone,
      password
    } = this.data;
    // 2.前端表单验证
    let phoneReg = new RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/)
    let pswReg = new RegExp(/[a-zA-Z0-9]{6}/)
    // 弹出提示框
    if (!phoneReg.test(phone) || !pswReg.test(password)) {
      wx.showToast({
        title: '手机号或密码不正确',
        icon: "none"
      })
      return
    }

    // 发送请求 引入request
    let result = await request("/login/cellphone", {
      phone,
      password,
      // 用于存储cookie做一个标识
      isLogin:true
    })
    /*
        登录接口
        用户名错误->状态为400
        密码错误  ->状态为502
        登陆成功  ->状态为200
     */
    // 登录成功
    if (result.code === 400) {
      wx.showToast({
        title: '用户名错误',
        icon: "none"
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: "none"
      })
    } else if (result.code === 200) {
      // 数据存储到storage中，为了以后可以获取登录信息
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(result.profile),
      })
      // 弹出提示
      wx.showToast({
        title: '登陆成功',
        icon: "success"
      })
      // 跳转到个人中心,因为个人中心是Tab Bar，使用要用wx.switchTab(Object object)
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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