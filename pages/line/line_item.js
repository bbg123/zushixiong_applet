var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: "",
  },
  getajax: function () {
    let that = this;
    let order = this.data.order
    gets.getdatas("/api/order/info", { "order_sn":order}, function (res) {
      let type = res.data.order_type;
      res.data.goods_list.forEach(item => {
        item.type = type
      });
      that.setData({
        goods_list:res.data.goods_list,
        types:res.data.order_type,
        shipping:res.data.shipping,
        is_shipping: res.data.is_shipping,
        order_type: res.data.order_type,
        price:res.data.price,
        order_time:res.data.order_time,
      })
    })
  },
  sees:function(){
    let order = this.data.order;
      wx.navigateTo({
        url: '../see_k/see_k?order='+order,
      })
  },
  no_see:function(){
    wx.showToast({
      title: '抱歉，该订单还未发货！',
      duration:2000,
      icon:"none"
    })
  },
  xiang:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id='+id,
    })
  },
  // 确认收货
  que:function(){
    let order  =this.data.order;
      gets.getdatas("/api/order/receiving_confirm",{"order_sn":order},function(res){
        if(res.code==0){
          wx.showModal({
            title: '',
            content: '确认成功',
            success:function(res){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }else{
          let msg = res.msg
          wx.showToast({
            title: msg,
            duration:2000,
            icon:"none"
          })
        }
      })
  },
  onLoad: function (potions) {
    var that = this;
    var order = potions.order;
    that.setData({
      order: order,
    })
    that.getajax();
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