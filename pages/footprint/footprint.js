var gets = require('../../utils/util.js');
var token;
Page({

  data: {
    dataitem: []
  },
  gocho: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'../choimmer/choimmer?id='+id
    })
  },
  getdata: function () {
    let that = this
    gets.getdatas("/api/track/get", {}, function (res) {
      that.setData({
        dataitem:res.data
      })
    })
  },
  onLoad: function () {
    this.getdata()
  },
  onShow: function () {
    token = wx.getStorageSync("token")
  }
})