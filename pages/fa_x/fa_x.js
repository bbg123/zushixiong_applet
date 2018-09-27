var gets = require('../../utils/util.js');
var token;
Page({

  data: {

  },
  // 获取数据
  getajax: function () {
    let that = this;
    let arr=[];
    let id = this.data.id;
    gets.getdatas("/api/discover/info", { "id":id }, function (res) { 
      arr.push(res.data)
      that.setData({
        items: res.data.images,
        all_items:arr
      })
    })
  },
  // 获取其他发现数据
  getall:function(){
    let that = this;
    var page = 1;
    gets.getdatas("/api/discover/get", {"page":page+1}, function (res) { 
      if(!res.data.data){
        gets.getdatas("/api/discover/get", { "page": page }, function (res) {
          that.setData({
            bottom_items: res.data.data
          })
         })
      }else{
        that.setData({
          bottom_items: res.data.data
        })
      }
    })
  },
  // 点赞
  like:function(e){
    let that = this;
      let id = e.currentTarget.dataset.id;
      gets.getdatas("/api/discover/addLike",{"id":id},function(res){  
        let msg = res.msg
        wx.showModal({
          title: '',
          content: msg,
        })
        that.getall();
        that.getajax();
      })
  },
  // 看大图
  see:function(e){
    let arr=[];
    let items = this.data.items;
    let src = e.currentTarget.dataset.src;
    for(let a= 0 ;a<items.length;a++){
      arr.push(items[a].file)
    }
    wx.previewImage({
      current: src,
      urls: arr,
    })
  },
  // 点击下面发现跳转
  jump:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../fa_x/fa_x?id='+id,
    })
  },
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      id:id
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token")
    this.getajax();
    this.getall();
  },
  onShareAppMessage: function () {

  }
})