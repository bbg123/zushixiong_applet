var gets = require('../../utils/util.js');
var token;
Page({
  data : {
    total: 0
  },
  goissue:function () {
    if (token) {
      wx.navigateTo({
        url: '../fabu_fa/fabu_fa'
      })
    }
  },
  jump_x:function(e){
    let id =e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../fa_x/fa_x?id='+id,
    })
  },
  // 发现点赞
  fazan: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let shai = this.data.shai;
    if (shai == "0") {
      gets.getdatas("/api/comment/addLike", { "comment_id": id }, function (res) {
        if (res.code == 0) {
          that.getshai();
        }
      })
    } else {
      gets.getdatas("/api/discover/addLike", { "id": id }, function (res) {
        if (res.code == 0) {
          that.getshai();
        }
      })
    }
  },
  onLoad: function (){
    let that = this
    gets.getdatas("/api/discover/myList",{},function (res) {
      that.setData({
        total:res.data.total,
        shai_items:res.data.data,
        like_num: res.data.like_num
      })
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token")
    
  }
})