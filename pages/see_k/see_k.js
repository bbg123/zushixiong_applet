var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
    index: "1",
  },
  taps: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      index: index,
    })
    this.getajax();
  },
  getajax: function () {
    let order = this.data.order; 
    let that = this;
    let types = that.data.index
    gets.getdatas("/api/express/trace", { "order_sn": order,"type":types},function(res){
        that.setData({
          order_item:res.data.order,
          mobile:res.data.info.Mobile || "",
          info:res.data.info.Traces
        })
    })
  },
  // 拨打电话
  phone:function(){
    let mobile = this.data.mobile;
    if (mobile != "") {
      wx.showModal({
        title: '跳转打电话给'+mobile,
        content: '',
        success:function(res){
          if (res.confirm){
            wx.makePhoneCall({
              phoneNumber: mobile,
            })
          }
        }
      })
    } else {
      wx.showToast({
        title:'无法拨打电话',
        duration:1000,
        icon:"none"
      })
    }
  },
  onLoad: function (potions) { 
      this.setData({
        order:potions.order
      })
      this.getajax();
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