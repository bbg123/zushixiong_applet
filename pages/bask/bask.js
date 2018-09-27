var gets = require('../../utils/util.js');
var token;
Page({

  data: {
    shai_items: [],
    shai: "0"
  },
  // 发现点赞
  fazan: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let shai = this.data.shai;
    if (shai == "0") {
      gets.getdatas("/api/comment/addLike", {
        "comment_id": id
      }, function (res) {
        if (res.code == 0) {
          that.getshai();
        }
      })
    } else {
      gets.getdatas("/api/discover/addLike", {
        "id": id
      }, function (res) {
        if (res.code == 0) {
          that.getshai();
        }
      })
    }
  },
  tapimg: function (e) {
    let arr = []
    e.currentTarget.dataset.list.forEach(function(item) {
      arr.push(item.file)
    })
   wx.previewImage({
    current: e.currentTarget.dataset.src,
    urls: arr
   })
  },
  getshai: function () {
    let that = this
    gets.getdatas("/api/comment/get", {goods_id:"-1"}, function (res) {
      that.setData({
        shai_items: res.data.data
      })
    })
  },
  jump: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  onLoad: function () {
    this.getshai();
  },
  onShow: function () {
    token = wx.getStorageSync("token")
  }
})