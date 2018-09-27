var gets = require('../../utils/util.js');
var img_urls = "https://www.zushixiong.com/api/comment/upload";//上传图片
var token;
Page({

  data: {
    chang: 0,
    ni: false,
    img_item: []
  },
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
              "DeviceId": 310995000000000,
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
  // 改变星的数量
  chang: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      chang: index,
    })
  },
  // 选择问题
  q: function (e) {
    let qtype = e.currentTarget.dataset.qtype;
    this.setData({
      qtype: qtype
    })
  },
  //发布
  send: function () {
    let text = this.data.text;
    let chang = this.data.chang;//评分星的数量
    let arrs = this.data.arrs;//获取渲染的图片数组数据
    let order = this.data.order;
    let id = this.data.id;
    let ni = this.data.ni;
    let types = this.data.qtype;//问题id
    if (!types) {
      types = 0;
    }
    if (ni == true) {
      ni = 1
    } else {
      ni = 0
    }
    if(!text){
      wx.showModal({
        title: '',
        content: '请填写评价',
      })
    }else{
      let dataStr = "order_sn=" + encodeURI(order) + "&goods_id=" + encodeURI(id) + "&goods_rank=" + encodeURI(chang) + "&content=" + encodeURI(text) +  "&type=" + encodeURI(types) + "&is_anonymous=" + encodeURI(ni);
      if (!arrs) {
        arrs = []
        dataStr += "&images=" + []

      } else {
        for (let a = 0; a < arrs.length; a++) {
          dataStr += "&images[]=" + encodeURI(arrs[a])
        }
      }
      dataStr = decodeURI(dataStr)
      if (arrs.length == arrs.length) {
        gets.getdatas("/api/comment/add", dataStr, function (res) {
          if (res.code == 0) {
            wx.navigateBack({
              delta: 1
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
    }
    
  },
  // 是否匿名
  ni: function (e) {
    let that = this;
    if (e.detail.value == true) {
      that.setData({
        ni: true,
      })
    } else {
      that.setData({
        ni: false,
      })
    }
  },
  // 建议
  text: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  onLoad: function (options) {
    let order = options.order;
    let id = options.id;
    this.setData({
      order: order,
      id: id,
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token")
  },

  onShareAppMessage: function () {

  },
})