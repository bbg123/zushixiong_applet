var gets = require('../../utils/util.js');
var urls = "https://www.zushixiong.com/api/service/qa";//问题列表
var token = wx.getStorageSync("token")

Page({

  data: {
    hiddens:true,
    b:0,
  },
  getajax:function(){
    let that = this;
    let index = this.data.index;
    gets.getdatas("/api/service/qa", {}, function (res) {
      let last_list = res.data[index].list;
      let title = res.data[index].name;
      that.setData({
        list:last_list,
        title: title,
      })
    })
  },
  up:function(e){
    this.setData({
      b:e.currentTarget.dataset.b
    })
  },
  onLoad: function (options) {
    let index = options.index;
    this.setData({
      index:index,
    })
    this.getajax();
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})