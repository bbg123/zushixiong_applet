var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
const app = getApp()
Page({
  data: {
    input_frame:false,
    type:0,
    moneyNum: ""
  },
  getRecordList:function() {
    let that = this
    gets.getdatas('/api/money/getRecordList',{},function(res) {
      wx.hideLoading()
      that.setData({
        record:res.data
      })
      wx.hideLoading()
    })
  },
  getmoneyNum:function() {
    let that = this
    gets.getdatas("/api/user/info",{},function(res) {
      that.setData({
        money:res.data.money
      })
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    gets.check(app, () => {
      this.getmoneyNum()
      this.getRecordList()
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  tapframe: function(e) {
    if (e.currentTarget.dataset.type == 2 && this.data.money == 0) {
      wx.showToast({
        title:"你的余额为零,无法提现",
        icon:"none",
        duration:1000
      })
      return false
    }
    this.setData({
      input_frame:true,
      type:e.currentTarget.dataset.type
    })
  },
  closeframe: function() {
    this.setData({
      input_frame:false
    })
  },
  // 获取输入钱的数量
  getmoneynum: function(e) {
    this.setData({
      moneyNum:e.detail.value
    })
  },
  payment: function(e) {
    let that = this
    if (this.data.moneyNum <= 0 || this.data.moneyNum == "") { //判断输入的金额是否为空
      wx.showToast({
        title:"请输入正确的金额",
        icon:"none",
        duration:1000
      })
      return false
    }
    if (e.currentTarget.dataset.type == 1) { //判断是不是充值
      wx.showLoading({
        'title':"正在加载",
        'mask':true,
      })
      gets.getdatas("/api/money/addMoney",{"pay_price":this.data.moneyNum},function(res) {
        var obj = res.data.jsApiParameters;
        let nonceStr = obj.nonceStr;
        let packages = obj.package;
        let paySign = obj.paySign;
        let signType = obj.signType;
        let timeStamp = obj.timeStamp;
        wx.hideLoading()
        wx.requestPayment({
          "timeStamp": timeStamp,
          "nonceStr": nonceStr,
          "package": packages,
          "signType": signType,
          "paySign": paySign,
          success: function (res) {
            gets.saveFormId(e,2)
            that.setData({
              input_frame:false
            })
            that.getmoneyNum()
            that.getRecordList()
          }
        })
      })
    } else if(e.currentTarget.dataset.type == 2) { //判断是不是提现
      wx.showModal({
        title:"是否提现："+this.data.moneyNum+"元",
        content:"提现金额将于1至3个工作日原路退回,请注意查收!",
        success:function(res) {
          if (res.confirm) {
            gets.getdatas("/api/money/drawMoney",{"pay_price":that.data.moneyNum},function(res) {
              if (res.code == 0) {
                gets.saveFormId(e,1)
                wx.showModal({
                  title:"提交成功",
                  content:res.msg,
                  showCancel:false,
                  success: function() {}
                })
                that.setData({
                  input_frame:false
                })
                that.getmoneyNum()
                that.getRecordList()
              } else {
                wx.showToast({
                  title:res.msg,
                  icon:"none",
                  duration:1500
                })
                return false
              }
            })
          }
        }
      }) 
    }
  }
})