var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")

Page({

  data: {
    
  },
  getajax:function(){
    gets.getdatas("/api/goods_collect/del_all",{},function(res){
      if(res.code==0){
        wx.showModal({
          title: '',
          content: '清除成功',
        })
      }
    })
  },
  synopsis:function(){
    wx.navigateTo({
      url: '../synopsis/synopsis',
    })
  },
  protect:function(){
    wx.navigateTo({
      url: '../protect/protect',
    })
  },
  clear:function(){
    let that = this
      wx.showModal({
        title: '注意',
        content: '请问是否要清除所有收藏商品',
        success:function(res){
          if (res.confirm){
            that.getajax();
          }
        }
      })
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})