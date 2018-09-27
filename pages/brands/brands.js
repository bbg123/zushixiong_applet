var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  data: {
    
  },
  getbrands:function(){
    let that = this;
    gets.getdatas("/api/brand/index",{},function(res){
      let hot_width = res.data.hot_list.length*520;
      that.setData({
        new_list:res.data.new_list,
        hot_list:res.data.hot_list,
        hot_width: hot_width,
      })

    })
  },
  // 获取品牌列表
  getbrand:function(){
    let that = this;
    gets.getdatas("/api/brand/get", {}, function (res) {
      that.setData({
        brand_list:res.data
      })
    })
  },
  // 跳转到品牌详情
  jumps:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../brand/brand?id='+id,
    })
  },
  onLoad: function (options) {
    this.getbrands();
    this.getbrand();
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})