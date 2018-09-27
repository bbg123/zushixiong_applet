var gets = require('../../utils/util.js');
var token;
Page({
  data: {
    page:1,
    type:2,
    zu:1,
  },
  getdata:function(){
    let that = this;
    let types = this.data.type;
    let page = this.data.page;
      gets.getdatas("/api/order/history", {"type":types,"page":page},function(res){
        that.setData({
            items:res.data.data
        })
      })
  },
  see:function(e){
    let order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '../see_k/see_k?order=' + order,
    })
    
  },
  // 点击租赁
  zu:function(){
    this.setData({
      zu:0,
      type: 1,
    })
    this.getdata();
  },
  // 点击购买
  buy:function(){
    this.setData({
      zu:1,
      type: 2,
    })
    this.getdata();
  },
  jump: function (e) {
    let id = e.currentTarget.dataset.id;
    let order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '../discuss_details/discuss_details?id=' + id+"&order="+order,
    })

  },
  // 查看评价
  csee: function (e) {
    let id = e.currentTarget.dataset.id;
    let order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '../ping_x/ping_x?id=' + id + "&order=" + order,
    })
  },
  onLoad: function (options) {
    let that = this
    let typec = options.type;
    if(typec==1){
      that.setData({
        zu: 0,
        type: 1,
      })
    }else if(typec==2){
      that.setData({
        zu: 2,
        type: 2,
      })
    }else{
      that.setData({
        zu: 0,
        type: 1,
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })

      },
    })

  },
  onShow: function () {
    token = wx.getStorageSync("token");
    this.getdata();
  },
  onShareAppMessage: function () {
    
  },
  // 订单详情页面
  xiang: function (e) {
    var order = e.currentTarget.dataset.orders;
    wx.navigateTo({
      url: '../line/line_item?order=' + order
    })
  },
})