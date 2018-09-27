Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:"22",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onShow: function () {
    let that =this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          height: res.screenHeight
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})