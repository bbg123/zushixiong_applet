var gets = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    type: false,
    frame: false,
    img: '',
    num: '123',
  },
  goback: function () {
    this.setData({
      type: true,
      frame: false
    })
  },
  GetUserInfo: function (e) {
    let that = this
    if (e.detail.userInfo) {
      wx.setStorageSync('username', e.detail.userInfo.nickName)
      wx.setStorageSync('userimg', e.detail.userInfo.avatarUrl)
      gets.getdatas("/api/xcx/updateUserInfo", {
        'nickName': e.detail.userInfo.nickName,
        'avatarUrl': e.detail.userInfo.avatarUrl,
        'gender': e.detail.userInfo.gender,
        'province': e.detail.userInfo.province,
        'city': e.detail.userInfo.city,
        'country': e.detail.userInfo.country,
        'language': e.detail.userInfo.language
      }, function (res) {
        that.setData({
          type: true,
          frame: false
        })
      })
    }

  },
  getToken: function () {
    this.setData({
      token: wx.getStorageSync('token')
    })
    let username = wx.getStorageSync('username') || ''
    wx.hideLoading()
    if (username != '') {
      this.setData({
        type: true
      })
    } else {
      this.setData({
        frame: true
      })
    }
  },

  getInfo: function() {
    let that = this
    gets.getdatas("/api/activity_draw1808/getInit", {
      id: that.data.id
    }, function (res) {
      that.setData({
        share_title: res.data.share.title,
        share_img: res.data.share.img
      })
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.share_title || '赶快来试一下吧',
      path: '/pages/test/test?link='+ this.data.link + '&id='+ this.data.id,
      imageUrl: this.data.share_img,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          duration: 1000
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.link) {
      this.setData({
        link: options.link
      })
    }
    if (options.id != undefined) {
      this.setData({
        id: options.id
      })
      this.getInfo()
    }
    wx.showLoading({
      title: '正在加载数据',
      mask: true
    })
    
    gets.check(app, function() {
      that.getToken()
    })
  },

  onShow: function () {
    let num = Math.random() * 100
    this.setData({
      num: num
    })
  }

})