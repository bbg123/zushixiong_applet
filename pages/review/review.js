var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  data: {
    actived: "0"
  },
  bigimg: function (e) {
    var arr = []
    e.currentTarget.dataset.arr.forEach(function (item) {
      arr.push(item.file)
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  clickbtn: function (e) {
    this.setData({
      actived: e.currentTarget.dataset.num
    })
    if (e.currentTarget.dataset.num == 0) {
      this.getdata(0)
    } else {
      this.getdata(1)
    }

  },
  getdata: function (num) {
    let that = this
    gets.getdatas("/api/comment/get", {
      page: 1,
      goods_id: this.data.id,
      is_img: num
    }, function (res) {
      that.setData({
        total: res.data.total,
        img_count: res.data.img_count,
        praise_rate: res.data.praise_rate,
        ping_item: res.data.data
      })
    })
  },
  ping_like: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    gets.getdatas("/api/comment/addLike", {
      "comment_id": id
    }, function (res) {
      let msg = res.msg;
      if (res.code == 0) {
        wx.showToast({
          title: msg,
          duration: 1000,
        })
      } else {
        wx.showToast({
          title: msg,
          duration: 1000,
        })
      }
      that.getdata(that.data.actived);
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getdata(0)
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {

  }
})