var gets = require('../../utils/util.js');
var img_urls = "https://www.zushixiong.com/api/comment/upload";//上传图片
var token;
Page({

  data: {

  },
  // 点击发布
  send: function () {
    let text = this.data.text;
    let img_item = this.data.arrs;
    let dataStr = "content=" + encodeURI(text)
    if (!img_item) {
      img_item = []
    } else {
      for (let a = 0; a < img_item.length; a++) {
        dataStr += "&images[]=" + encodeURI(img_item[a])
      }
    }
    if(!text){
      wx.showModal({
        title: '',
        content: "请填写文本",
      })
    }else{
      gets.getdatas("/api/discover/add", dataStr, function (res) {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1,
          })
        } else {
          let msg = res.msg;
          wx.showModal({
            title: '',
            content: msg,
          })
        }
      })
    }
  },
  // 建议
  text: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  // 图片
  sds: function () {
    let arr = [];
    let that = this;
    var b;
    var a;
    let arrs = [];
    wx.chooseImage({
      count: 5,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          img_item: tempFilePaths
        })
        for (a = 0; a < tempFilePaths.length; a++) {
          wx.uploadFile({
            url: img_urls,
            filePath: tempFilePaths[a],
            name: 'file[]',
            header: {
              "Content-Type": "multipart/form-data",
              "DeviceId": "xcx",
              "access-token": token,
            },
            formData: {
              'user': 'test',
            },
            success: function (res) {
              let str = res.data
              var json = JSON.parse(str);
              var url = json.data[0].url;
              arrs.push(url)
            }
          })
        }
        that.setData({
          arrs: arrs
        })
      },
    })
  },
  onLoad: function (options) {

  },
  onShow: function () {
    token = wx.getStorageSync("token")
  },
  onShareAppMessage: function () {

  }
}) 