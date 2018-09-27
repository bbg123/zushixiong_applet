var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  data: {
    a:"申请退押金",
    b:"退款中",
    c:"退款成功",
  },
  // 押金列表
  getajax:function(){
    let that = this;
    gets.getdatas("/api/order/deposit",{},function(res){
      that.setData({
        items:res.data.data
      })
    })
  },
  touch:function(e){
    let that = this
    let order = e.currentTarget.dataset.order;
    let id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.type==0){
      gets.getdatas("/api/order/refund_deposit", { "order_sn": order,"goods_id":id},function(res){
        if(res.code==0){
          wx.showToast({
            title: '申请成功',
            duration:1000
          })
          that.getajax();
        }else{
          let msg = res.msg
          wx.showToast({
            title: msg,
            content: '',
            duration:1000
          })
        }
      })
    }
  },
  onLoad: function (options) {
    this.getajax();
  },
  onShow: function () {
    token = wx.getStorageSync("token");
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