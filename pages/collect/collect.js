var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
    tang:false,
    arr:"",
  },
  goH: function () {
    wx.redirectTo({
      url: '../Home/home',
    })
  },
  goC: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  goM:function(){
    wx.redirectTo({
      url: '../me/me',
    })
  },
  getajax: function () {
    let that = this;
      gets.getdatas("/api/goods_collect/get",{},function(res){
          that.setData({
            bodyitems: res.data.data,
          })
      })
  },
  // 品牌列表
  getbrand:function(){
      let that = this;
      gets.getdatas("/api/brand/get",{},function(res){
        let arr=[];
        for(let a = 0 ;a<res.data.length;a++){
          for(let b = 0;b<res.data[a].list.length;b++){
            if (res.data[a].list[b].is_collect==true){
              arr.push(res.data[a].list[b].id)
            }
          }
        }
        that.setData({
          top_list:res.data,
          arr:arr,
        })
      })
  },
  // 关掉弹出窗
  canr:function(){
    let tang =!this.data.tang
    this.setData({
      tang:tang
    })
  },
  gethader:function(){
    let that = this;
    gets.getdatas("/api/brand/collect",{},function(res){
      let all_width = (res.data.length+1)*160;
      that.setData({
        headitems:res.data,
        all_width: all_width
      })
    })
  },
  // 清除品牌
  clears:function(){
    let that = this;
    let top_list = this.data.top_list;
    for(let a=0;a<top_list.length;a++){
      for(let b=0;b<top_list[a].list.length;b++){
        let aa = "top_list["+a+"].list["+b+"].is_collect";
        that.setData({
            [aa]:0,
        })
      }
    }
      let arr=[];
      this.setData({
        arr:arr,
      })
  },
  // 多选
  choss:function(e){
    let arr = this.data.arr;
    let ids = e.currentTarget.dataset.id;
    let id = e.detail.value;
    this.setData({
      arr: e.detail.value
    })
  },
  // 
  xian:function(){
    let tang = !this.data.tang;
    this.setData({
      tang:tang,
    })
    this.getbrand();
  },
  // 确认
  luo: function(){
      let arr = this.data.arr;
      let str = arr.join();
      let that = this;
      if(!token){
      }
      gets.getdatas("/api/brand/add_collects",{"ids":str},function(res){
        if(res.code==0){
          that.setData({
            tang:false,
          })
          that.gethader();
        }
      })
  },
  // 跳转商品详情
  jump: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id
    })
  },
  // 跳转到品牌详情
  jumps:function(e){
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../brand/brand?id='+id,
    })
  },
  onLoad: function () {
    var that = this;
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    }) 
  },
  onShow:function(){
    token = wx.getStorageSync("token")
    let that = this;
    that.gethader();
    that.getbrand();
    that.getajax();
  }
})
