var gets = require('../../utils/util.js')
var token
const app = getApp()
Page({
  data: {
    username: "WELCOME",
    userImg: "../img/heade.png",
    welcome: "你还是不会员,请登录",
    vip_tips_show: false
  },
  order0: function () {
    wx.navigateTo({
      url: '../order/order?type=1'
    })
  },
  order1: function () {
    wx.navigateTo({
      url: '../order/order?type=2'
    })
  },
  my_bask: function () {
    wx.navigateTo({
      url: '../bask/bask'
    })
  },
  get_roll: function () {
    wx.navigateTo({
      url: '../getroll/getroll'
    })
  },
  footprint: function () {
    wx.navigateTo({
      url: '../footprint/footprint'
    })
  },
  my_pay: function () {
    wx.navigateTo({
      url: '../my_pay/my_pay'
    })
  },
  set: function () {
    wx.navigateTo({
      url: '../set/set'
    })  
  },
  GetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.setStorageSync('username', e.detail.userInfo.nickName)
      wx.setStorageSync('userimg', e.detail.userInfo.avatarUrl)
      this.setData({
        userImg: e.detail.userInfo.avatarUrl,
        username: e.detail.userInfo.nickName
      })
      // gets.getdatas("/api/xcx/updateUserInfo",{
      //   'nickName':e.detail..userInfo.nickName,
      //   'avatarUrl':e.detail.userInfo.avatarUrl,
      //   'gender':e.detail.userInfo.gender,
      //   'province':e.detail.userInfo.province,
      //   'city':e.detail.userInfo.city,
      //   'country':e.detail.userInfo.country,
      //   'language':e.detail.userInfo.language
      // },function (res) {})

      wx.request({
        url: 'https://api.zushixiong.com/api/xcx/saveUserInfo',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "DeviceId": "xcx",
          "access-token": wx.getStorageSync('token'),
        },
        data: {
          rawData: e.detail.rawData,
          signature: e.detail.signature,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        dataType: "json",
        success: (res) => {
          console.log(res)
        }
      })
    }
  },
  // 跳转历史订单
  hri:function(){
    wx.navigateTo({
      url: '../history/history'
    })
  },
  my_cupont: function () {
    wx.navigateTo({
      url: '../coupon/coupon?type=1'
    })
  },
  my_wallet: function() {
    wx.navigateTo({
      url: '../my_wallet/my_wallet'
    })
  },
  my_address: function () {
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
  problem: function () {
    wx.navigateTo({
      url: '../problem/problem'
    })
  },
  my_discover: function () {
    wx.navigateTo({
      url: '../my_discover/my_discover'
    })
  },
  proposal: function () {
    wx.navigateTo({
      url: '../proposal/proposal'
    })
  },
  onLoad: function (p) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })
    let name = wx.getStorageSync('username')
    let img = wx.getStorageSync('userimg')
    if (name) {
      this.setData({
        userImg: img,
        username: name,
        welcome: '欢迎来到租师兄,戴遍全球腕表新品'
      })
    }
    // 获取邀请码参数
    gets.get_res(p, app)
  },
  onShow: function () {
    token = wx.getStorageSync("token")
  },
  onShareAppMessage: function (res) {
    let shareCode = wx.getStorageSync("share_code")
    return {
      title: '超好玩的租赁平台,赶快来加入吧',
      path: '/pages/me/me?shareCode='+shareCode,
      success: function (res) {  
        // 转发成功
        wx.showToast({
          title: '转发成功',
          duration:1000
        })
      }  
    }
  },
  showVipTips: function() {
    this.setData({
      vip_tips_show: true
    })
  },
  hideVipTips: function() {
    this.setData({
      vip_tips_show: false
    })
  }
})
