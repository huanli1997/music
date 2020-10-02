// pages/song/song.js
import request from '../../../utils/request.js'
// pubsub 实现组件通信，类似于vuex的消息订阅
import PubSub from 'pubsub-js'
// 获取存储在全局APP上的数据
let appInstance = getApp()

// 引入时间库
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否在播放
    isPlaying: false,
    // 当前进入歌曲信息
    songId: null,
    songs: [],
    musicUrl: "",
    currentTime: "00:00",
    durationTime: "--:--",
    // 进度百分比
    currentWidth: 0
  },

  // 点击播放按钮
  async handlePlay() {
    // 获取音频地址
    await this.getMusicUrl()

    // 点击播放->播放c3效果开始
    // setData 同步修改数据，异步渲染页面
    this.setData({
      isPlaying: !this.data.isPlaying
    })

    // 播放音频
    this.playAudio()
  },

  // 绑定所有监听
  addAudioListener() {
    //监听背景音频播放器的是否进入播放状态
    this.backgroundAudioManager.onPlay(() => {
      //判断当前页面的歌曲是否与我背景音频播放的相同,如果相同才改变他的页面C3效果播放状态
      if (this.data.songId === appInstance.globalData.audioId) {
        this.setData({
          isPlaying: true
        })
        appInstance.globalData.playState = true
      }
    })

    //监听背景音频播放器的是否进入暂停状态
    this.backgroundAudioManager.onPause(() => {
      //判断当前页面的歌曲是否与我背景音频播放的相同,如果相同才改变他的页面C3效果播放状态
      if (this.data.songId === appInstance.globalData.audioId) {
        this.setData({
          isPlaying: false
        })
        appInstance.globalData.playState = false;
      }
    })

    this.backgroundAudioManager.onStop(() => {
      //判断当前页面的歌曲是否与我背景音频播放的相同,如果相同才改变他的页面C3效果播放状态
      if (this.data.songId === appInstance.globalData.audioId) {
        this.setData({
          isPlaying: false
        })
        appInstance.globalData.playState = false;
      }
    })

    this.backgroundAudioManager.onEnded(() => {
      // 监听背景音频自然播放结束事件
      // 切换到下一首
      PubSub.publish('switchType', "next");
    })


    this.setData({
      // moment 接受一个毫秒
      durationTime: moment(this.data.songs[0].dt).format("mm:ss")
    })

    //监听背景音频播放器的是否进入更新状态
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log("onTimeUpdate")
      // 当前音频的播放位置（单位：s）
      let currentTime = this.backgroundAudioManager.currentTime
      // 当前音频的长度（单位：s）
      let durationTime = this.backgroundAudioManager.duration


      this.setData({
        ///使用moment格式化时间
        currentTime: moment(currentTime * 1000).format("mm:ss"),
        //  因为相除，最大是1 ，所有需要扩大100倍
        currentWidth: (currentTime / durationTime) * 100
      })

    })
  },

  // 切换歌曲
  switchSong(event) {
    let {
      id
    } = event.currentTarget
    // 发布消息，告诉recommend页面，是需要上一首还是下一首的id
    PubSub.publish('switchType', id);
  },

  // 请求音频地址
  async getMusicUrl() {
    let musicUrlData = await request('/song/url', {
      id: this.data.songId
    });

    this.setData({
      musicUrl: musicUrlData.data[0].url
    })
  },

  // 用于获取歌曲相信消息
  async getMusicDetail() {
    // 发送请求，获取歌曲详情
    let result = await request('/song/detail', {
      ids: this.data.songId
    })

    this.setData({
      songs: result.songs,
    })

    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: this.data.songs[0].name,
    })
  },

  // 播放音频
  playAudio() {
    // 判断当前播放状态
    if (this.data.isPlaying) {
      // 给 BackgroundAudioManager 实例设置src和title，实现音频播放
      // backgroundAudioManager.src 当设置了新的 src 时，会自动开始播放
      this.backgroundAudioManager.src = this.data.musicUrl
      this.backgroundAudioManager.title = this.data.songs[0].name

      // 跳转到指定时间
      // this.backgroundAudioManager.startTime = 180
      // 记录当前播放状态到全局app中
      appInstance.globalData.playState = true
      // audioId 正在播放歌曲的id
      appInstance.globalData.audioId = this.data.songId;
    } else {
      // 暂停播放音频
      this.backgroundAudioManager.pause()
      appInstance.globalData.playState = false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 读取存储在全局上app上的数据
    // console.log("appInstance", appInstance.globalData)

    // options 可以获取，通过路径传递过来的参数
    let {
      songId
    } = options;

    this.setData({
      songId: songId * 1,
    })

    // 发送请求，获取歌曲详情
    await this.getMusicDetail()

    // 当用户进入song页面的时候，如果背景音频正在播放的是当前的歌曲，就自动进入c3效果
    let {
      playState,
      audioId
    } = appInstance.globalData

    if (playState && audioId === this.data.songId) {
      this.setData({
        isPlaying: true
      })
    }

    // 获取 BackgroundAudioManager 实例
    // 因为需要监听backgroundAudioManager的状态,使用把backgroundAudioManager挂载到上
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    this.addAudioListener()

    // 订阅getMusicID，获取recommend页面传递过来的id
    PubSub.subscribe('getMusicID', async(msg, songId) => {
      // 获取到歌曲对应的id，请求歌曲详细地址，播放对应歌曲
      this.setData({
        songId
      })
      // 获取歌曲详情
      await this.getMusicDetail()

      // 请求歌曲详细地址
      await this.getMusicUrl()

      // 更新播放状态
      this.setData({
        isPlaying: true
      })
      // 播放对应歌曲
      this.playAudio()
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