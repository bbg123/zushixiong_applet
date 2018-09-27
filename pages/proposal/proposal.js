var gets = require('../../utils/util.js');
var urls = "https://www.zushixiong.com/api/service/feedback";//问题列表
var token = wx.getStorageSync("token")



Page({

  data: {
    
  },
  text:function(e){
    let text = e.detail.value; 
    this.setData({
      text:text,
    })
  },
  getajax:function(){
    let name = this.data.username;
    let text = this.data.text; 
    if(text==undefined){
      wx.showModal({
        title: '',
        content: '请输入你需要提交的建议！',
      })
    }else{
      gets.getdatas("/api/service/feedback", { "nick_name": name, "content": text }, function (res) {
        if (res.code == 0) {
          wx.showModal({
            title: '',
            content: '提交成功',
            success: function (res) { 
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        } else {
          let msg = res.msg;
          wx.showModal({
            title: msg,
            content: '',
          })
        }
      })
    }
  },
  give:function(){
    this.getajax();
  },
  onLoad: function () {
    let username = wx.getStorageSync('username')
    this.setData({
      username: username,
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})