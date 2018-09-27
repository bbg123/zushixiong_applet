var gets = require('../../utils/util.js');
var token;
Page({

  data: {
    rollitem: [],
  },
  get_roll: function (e) {
    let that = this
    gets.getdatas("/api/coupon/add", {
      id: e.currentTarget.dataset.id
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        that.getdata()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  getdata: function () {
    let that = this
    gets.getdatas("/api/coupon/getList", {}, function (res) {
      that.setData({
        rollitem: res.data
      })
    })
  },
  onLoad: function () {
    token = wx.getStorageSync("token")
    if (token) {
      this.getdata()
    }
  },
  onShow: function () {}
})