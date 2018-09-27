var gets = require('../../utils/util.js');
var token;
Page({

  data: {

  },
  // 获取渲染数据
  getajax: function () {
    let arr=[];
    let that = this;
    let order = this.data.order;
    let id = this.data.id;
    gets.getdatas("/api/comment/info", { "order_sn": order, "goods_id": id }, function (res) {
      if (res.code == 0) {
        arr.push(res.data);
        let widths = res.data.images.length * 360
        that.setData({
          items:arr,
          widths: widths
        })
      }
    })
  },
  onLoad: function (options) {
    let order = options.order;
    let id = options.id;
    this.setData({
      order:order,
      id:id
    })

  },
  onShow: function () {
    token = wx.getStorageSync("token")
    this.getajax();
  },
  onShareAppMessage: function () {

  }
})