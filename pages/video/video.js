// pages/video/video.js
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroup: [],
    currentId: "null",
    videoList: [],
    // 下拉刷新标识
    trigger: false,
    // 点击播放的时候，存入的视频id
    vid: "",
    // 当前需要播放的视频id
    videoId:null
  },

  //  切换视频分类选项卡
  async changeId(event) {
    let {
      id
    } = event.currentTarget.dataset
    this.setData({
      currentId: id,
      // 在加载其他页面时，清空之前的列表数据
      videoList: []
    })

    // 显示加载提示框
    wx.showLoading({
      title: "加载中，请稍后"
    })

    // 重新发送请求
    await this.getVideoListData()

    // 隐藏加载提示框
    wx.hideLoading()
  },

  // 获取具体视频列表
  async getVideoListData() {
    let result = await request("/video/group", {
      id: this.data.currentId
    })
    // console.log(result)
    this.setData({
      videoList: result.datas
    })
  },

  // 下拉刷新
  async refresherRefresh() {
    // 当下拉刷新的时候，refresher-triggered的状态会自动变为true

    // 重新发送请求，获取新数据
    await this.getVideoListData()

    // 数据请求到后，标识改为false
    this.setData({
      trigger: false
    })
  },

  // 上拉加载更多
  scrollToLower() {
    // 因为没有接口所以使用假数据
    let data;
    setTimeout(() => {
      data = [{
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_57B282070780439AB8B7EEBADA7B0BF4",
            "coverUrl": "https://p1.music.126.net/9rQe8QvlonyK_6gjUs-KBw==/109951163405417082.jpg",
            "height": 720,
            "width": 1280,
            "title": "Wake (Live ) - Hillsong Young & Free",
            "description": "该回来的，总会回来",
            "commentCount": 116,
            "shareCount": 356,
            "resolutions": [{
                "resolution": 240,
                "size": 34912508
              },
              {
                "resolution": 480,
                "size": 58638761
              },
              {
                "resolution": 720,
                "size": 81994785
              }
            ],
            "creator": {
              "defaultAvatar": false,
              "province": 1000000,
              "authStatus": 0,
              "followed": false,
              "avatarUrl": "http://p1.music.126.net/yX7jUxKx0MQsKKHm09TdKQ==/109951162889224877.jpg",
              "accountStatus": 0,
              "gender": 1,
              "city": 1002700,
              "birthday": 809712000000,
              "userId": 250935934,
              "userType": 0,
              "nickname": "DJGrandMother",
              "signature": "心情如歌",
              "description": "",
              "detailDescription": "",
              "avatarImgId": 109951162889224880,
              "backgroundImgId": 109951164570679090,
              "backgroundUrl": "http://p1.music.126.net/lnHCc8D-vLK3E7AphhCO6w==/109951164570679086.jpg",
              "authority": 0,
              "mutual": false,
              "expertTags": null,
              "experts": null,
              "djStatus": 0,
              "vipType": 11,
              "remarkName": null,
              "avatarImgIdStr": "109951162889224877",
              "backgroundImgIdStr": "109951164570679086",
              "avatarImgId_str": "109951162889224877"
            },
            "urlInfo": {
              "id": "57B282070780439AB8B7EEBADA7B0BF4",
              "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/P8DZRued_1777476644_shd.mp4?ts=1600919817&rid=67045BE5AADF7E81410E9AF64893300E&rl=3&rs=owHvOhzRHwjbLkDlIdLYmEYcpddxViic&sign=33d87cbee10371f85374a1f2bea82a9f&ext=MbQfiMjsqTjGUrkgAnxbxsSylRxH5VhHzFV5ThhjfyiSCkcYqls2QnMPFzPFNGf2TzxMdlMd3x85Re1upgk5GucHgnVYTYzUr%2BxJl2GJta0KMD2nLWP%2BHVZ3D0Kpgp%2BFprsHzNg%2F0k3A8ZmrhP57eQRGhbFLB%2BDO4NukIn%2BPPUcgxDMeBXvSSet8RB2N86GBR%2F0dG%2FSoju1XlcCQhMHVQtP3pMZpRL9aYLx%2Bg8qHbKJqZUsE8IvZefqWchakvvSO",
              "size": 81994785,
              "validityTime": 1200,
              "needPay": false,
              "payInfo": null,
              "r": 720
            },
            "videoGroup": [{
                "id": 57106,
                "name": "欧美现场",
                "alg": "groupTagRank"
              },
              {
                "id": 59108,
                "name": "巡演现场",
                "alg": "groupTagRank"
              },
              {
                "id": 1100,
                "name": "音乐现场",
                "alg": "groupTagRank"
              },
              {
                "id": 58100,
                "name": "现场",
                "alg": "groupTagRank"
              },
              {
                "id": 5100,
                "name": "音乐",
                "alg": "groupTagRank"
              }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "57B282070780439AB8B7EEBADA7B0BF4",
            "durationms": 279173,
            "playTime": 131625,
            "praisedCount": 1308,
            "praised": false,
            "subscribed": false
          }
        }],
        // 保留原来的数据，把新数据添加进去 拆包
        this.setData({
          videoList: [...this.data.videoList, ...data]
        })
    }, 2000)
  },


  // 视频播放
  // 如果使用图片替换video标签，就不存在点击下一个视频停止上一个视频的问题
  // handlePlay(event) {

  //   // event.currentTarget 当前视频的id
  //   let {
  //     id
  //   } = event.currentTarget

  //   // wx.createVideoContext(string id, Object this)  创建 video 上下文 VideoContext 对象
  //   // 如果上一个视频存在并且不是点击的同一个视频
  //   if (this.vid && id !== this.vid) {
  //     let preVideoContext = wx.createVideoContext(this.vid);
  //     // VideoContext.pause() 暂停视频
  //     preVideoContext.pause()
  //   }
  //   // console.log(event.currentTarget.id)

  //   // 把id 挂载到this上 上一个视频的id
  //   this.vid = id
  // },

  // 点击图片切换为视频标签
  changeVideoId(event){
    // 获取当前图片的id把它赋值给data里面的videoId
    let { id } = event.currentTarget
    // console.log(id)
    this.setData({
      videoId: id
    })

    // 自动播放
    let videoContext = wx.createVideoContext(id);
    // 播放
    videoContext.play();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 获取视频分类
    let result = await request("/video/group/list")
    // 初始化一个id
    let currentId = result.data[0].id
    this.setData({
      currentId,
      videoGroup: result.data.slice(0, 15)
    })

    this.getVideoListData()

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
  /* 
    from 转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
    target 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    此事件处理函数需要 return 一个 Object，用于自定义转发内容，返回内容如下
   */
  onShareAppMessage: function({
    from,
    target
  }) {
    if (from === "menu") {
      // 顶部转发
      return {
        title: "网易云",
        // 当前页面 path ，必须是以 / 开头的完整路径
        path: "/pages/index/index",
        imageUrl: "/static/images/logo.png"
      }
    } else if (from === "button") {
      console.log(target)
      let {
        title,
        imageurl
      } = target.dataset
      // 按button转发
      // 因为title和imageUrl没有，target属性可以获取到标签的自定义属性，使用我们手动给对应的标签上添加我们需要的自定义属性
      return {
        title: title,
        path: "/pages/video/video",
        imageUrl: imageurl
      }
    }
  }
})