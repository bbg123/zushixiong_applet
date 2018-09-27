var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
    indexc: 0,
    money: 0,
    couponIndex: 0
  },
  getajax: function () {
    let arr = wx.getStorageSync('buy_list')
    this.setData({
      buy_list: arr[0].list,
      shipping_price: parseInt(arr[0].shipping_price),
      mymoney: wx.getStorageSync('mymoney')
    })
    this.getcoupon()
  },
  add: function () {
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
  getcoupon: function () {
    let that = this
    gets.getdatas("/api/coupon/getMyList", {
      order_type: that.data.type
    }, function (res) {
      let arr = [{
        "name": "暂无可用",
        "money": 0,
        "condition": 0,
        "id": 0
      }]
      if (res.data.length != 0) {
        res.data.forEach(item => {
          arr.push(item)
          that.setData({
            couponList: arr
          })
        })
      } else {
        that.setData({
          couponList: arr
        })
      }

      that.give_pay();
    })
  },
  // 计算价格
  give_pay: function () {
    let all = 0
    let rents = 0
    let str = ""
    let bignum = 0
    let money = 0
    let id = 0
    let lastCondition = 0
    this.data.buy_list.forEach(item => {
      if (this.data.type == 1) {
        all += item.pledge_price * item.goods_num
        rents += item.rent_price * item.goods_num
      } else {
        all += item.goods_price * item.goods_num
        rents += item.goods_price * item.goods_num
      }
      str += item.goods_id + ","
    })
    // 循环优惠劵列表,筛选出符合条件的优惠劵及优惠价格最高的
    this.data.couponList.forEach((item, index) => {
      // 判断是否符合条件和是否是最优惠的价格
      if (item.condition < rents && item.condition > lastCondition) {
        lastCondition = item.condition
        bignum = index
        money = item.money
        id = item.id
      }
    })
    str = str.substr(0, str.length - 1)
    this.setData({
      give_pay: parseInt(all),
      rent_price: parseInt(rents),
      str: str,
      couponIndex: bignum,
      money: parseInt(money),
      id: id
    })
  },
  getrreajax: function () {
    let that = this;
    let index = this.data.indexc
    gets.getdatas("/api/address/get", {}, function (res) {
      if (res.data.length != 0) {
        that.setData({
          trer: true,
        })
        let nums = res.data[index].mobile;
        that.setData({
          nums: nums
        })
        that.setData({
          address: res.data[index],
        })
      } else {
        that.setData({
          trer: false,
        })
      }
    })
  },
  // 点击支付
  go_give: function () {
    let that = this
    let test = this.data.address;
    if (!test) {
      wx.showModal({
        title: '',
        content: '请选择地址',
      })
    } else {
      let that = this
      let all
      // 判断是买还是租
      if (that.data.type == 1) {
        all = parseInt(that.data.give_pay) + parseInt(that.data.rent_price) - parseInt(that.data.money) - parseInt(that.data.mymoney)
      } else {
        all = parseInt(that.data.give_pay) - parseInt(that.data.money) - parseInt(that.data.mymoney)
      }
      if (all < 0) {
        wx.showModal({
          content: '是否支付订单',
          success: function (res) {
            if (res.confirm) {
              that.saveorder(all)
            }
          }
        })
      } else {
        that.saveorder(all)
      }
    }
  },
  // 生成订单
  saveorder: function (all) {
    let that = this
    let address_id = this.data.address.address_id;
    let order = this.data.buy_list[0].order_sn;
    gets.getdatas("/api/order/save", {
      "order_sn": order,
      "address_id": address_id
    }, function (res) {
      if (res.code == 0) {
        that.setData({
          tou: true,
        })
        let order = that.data.buy_list[0].order_sn
        let str = that.data.str
        let phone = that.data.nums
        let coupon_id = that.data.id
        gets.getdatas("/api/order/pay_verify", {
          "order_sn": order,
          "pay_name": "xcx",
          // 判断钱包的钱是否足够支付
          "pay_price": all < 0 ? 0 : all,
          "device_info": phone,
          "body": str,
          "coupon_id": coupon_id
        }, function (res) {
          if (res.code == 0 && res.data.length != 0) {
            var obj = res.data.jsApiParameters;
            let nonceStr = obj.nonceStr;
            let packages = obj.package;
            let paySign = obj.paySign;
            let signType = obj.signType;
            let timeStamp = obj.timeStamp;
            wx.requestPayment({
              "timeStamp": timeStamp,
              "nonceStr": nonceStr,
              "package": packages,
              "signType": signType,
              "paySign": paySign,
              success: function (res) {
                that.backorder('租赁成功，快递签收次日开始计费')
              },
              fail: function (res) {
                that.setData({
                  tou: false,
                })
              }
            })
          } else if (res.code == 0) {
            that.backorder('租赁成功，快递签收次日开始计费')
          } else {
            that.backorder('支付失败,请重试')
          }
        })
      }
    })
  },
  // 返回订单页
  backorder: function (msg) {
    let that = this
    wx.removeStorageSync("coupon_id")
    wx.removeStorageSync("money")
    wx.removeStorageSync("title")
    that.setData({
      tou: false,
    })
    if (parseInt(that.data.type) == 1) {
      wx.showModal({
        title: '提示',
        content: msg,
        success: function () {
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            currentTab: '1',
            currentNum: 1
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.showToast({
        title: '购买成功',
        duration: 2000,
        mask: true,
        success: function () {
          let pages = getCurrentPages(); //当前页面；
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            currentTab: '2',
            currentNum: 1
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 选择购物卷
  couponPickerChange: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.couponList
    if (that.data.rent_price >= list[index].condition) {
      that.setData({
        couponIndex: index,
        coupon: list[index],
        money: parseInt(list[index].money),
        id: parseInt(list[index].id)
      })
    } else {
      wx.showToast({
        title: "未满足条件",
        icon: 'none',
        duration: 3000,
      })
    }

  },
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getajax()
  },
  onShow: function () {
    token = wx.getStorageSync("token")
    wx.removeStorageSync("coupon_id")
    wx.removeStorageSync("money")
    wx.removeStorageSync("title")
    let index = wx.getStorageSync("index")
    if (index == NaN || index === "") {} else {
      this.setData({
        indexc: index,
      })
    }
    this.getrreajax();
  },
  onUnload: function () {
    wx.removeStorageSync("mymoney")
    wx.removeStorageSync("buy_list")
  },
})