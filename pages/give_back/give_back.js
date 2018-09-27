var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
      name:"",
      orders:"",
      order:"",
      goods_id:"",
  },
  one:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  two: function (e) {
    this.setData({
      orders: e.detail.value
    })
  },
  // 扫一扫
  sweepcode:function() {
    let that = this
    wx.scanCode({
      success:function(res) {
        that.setData({
          orders:res.result
        })
      }
    })
  },
  // 申请归还
  back:function(){
    let order = this.data.order;
    let goods_id = this.data.goods_id;
    let name = this.data.name;
    let orders = this.data.orders;
    gets.getdatas("/api/order/give_back", {
      "order_sn": order,
      "goods_id": goods_id,
      "shipping_name": name,
      "shipping_code":orders,
      "goods_color_id":this.data.goods_color_id
    },function(res){
        if(res.code==0){
          wx.showModal({
            title: '申请成功',
            success:function(res){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }else{
          let msg = res.msg
          wx.showModal({
            title: msg,
            content: '',
          })
        }
    })
  },
  onLoad: function (potions) {
    this.setData({
      order:potions.order,
      goods_id:potions.id,
      goods_color_id:potions.colid
    })
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