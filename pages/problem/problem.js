var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")

Page({

  data: {
    
  },
  getajax:function(){
    let that = this;
    gets.getdatas("/api/service/qa", {}, function (res) {
      that.setData({
        list:res.data
      })
    })
  },
  jump:function(e){
    let index = e.currentTarget.dataset.idnex
    wx.navigateTo({
      url: '../problem_s/problem_s?index='+index,
    })
  },
  onLoad: function (options) {
    this.getajax();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})