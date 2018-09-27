var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")


Page({

  data: {
    index: 0
  },
  getajax: function () {
    let that = this
    gets.getdatas("/api/coupon/getMyList", {}, function (res) {
      let arr0 = []
      let arr2 = []
      let arr3 = []
      res.data.forEach(item => {
        switch (item.status) {
          case 0:
            arr0.push(item)
            break

          case 1:
            arr2.push(item)
            break

          case 2:
            arr2.push(item)
            break

          case 3:
            arr3.push(item)
            break
        }
      })
      that.setData({
        list: arr0,
        is_use: arr2,
        use_lose_list: arr3
      })
    })
  },
  wei: function (e) {
    let index = e.currentTarget.dataset.choss;
    this.setData({
      index: index,
    })
  },
  onLoad: function () {
    this.getajax();
  },
  onShow: function () {
    let that = this
    token = wx.getStorageSync("token")
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          heights: res.windowHeight
        })
      }
    })
  },
  swipercurrent: function (e) {
    this.setData({
      index: e.detail.current
    })
  },
  go_index: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})