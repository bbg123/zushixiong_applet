var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")

Page({

  data: {
    index: 0,
    num: 0,
  },
  getajax: function () {
    let that = this;
    let index = this.data.index;
    gets.getdatas("/api/index/getInitList", {}, function (res) {
      let items = res.star_list[index].list;
      let newarr = [];
      let srcs=[];
      for (let a = 0; a < items.length; a++) {
        if (a == 0) {
        } else {
          newarr.push(res.star_list[index].list[a]);
        }
      }
      that.setData({
        items: newarr,
        srcs:newarr
      })
    })
  },
  index: function (e) {
    this.setData({
      num: e.detail.current,
    })
  },
  jum: function () {
    let index = this.data.num
    this.setData({
      index: index,
    })
    let id = this.data.items[index].goods_id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  imgs:function(e){
    let src = e.currentTarget.dataset.src;
    let srcs = []
    this.data.srcs.forEach(function (item){
      srcs.push(item.img)
    })
    wx.previewImage({
      current:src,
      urls: srcs ,
    })
  },
  onLoad: function (options) {
    let num = options.num;
    this.setData({
      index: num
    })
    this.getajax();
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {

  }
})