var gets = require('../../utils/util.js')
var token = wx.getStorageSync("token")
var timer = 0
Page({
  data: {
    currentTab: "",
    index: "",
    buy_list: "",
    indexb: 0,
    ds: [], //开关
    xu_index: "",
    dx: [], //选择开关
    buy_out:false,
    outofpocket:0
  },
  swichNav: function (e) {
    if (this.data.currentNum === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentNum: e.target.dataset.current
      })
    }
  },
  // 滑动滑块
  change: function (e) {
    this.setData({
      currentNum: e.detail.current
    })
  },
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //数量加减
  test: function (e) {
    let that = this;
    var index = e.target.dataset.cc;
    var order = this.data.buy_list[index].order_sn;
    var goods_id = this.data.buy_list[index].goods_id;
    var deletedTodo = "buy_list[" + index + "].goods_num";
    var nums = that.data.buy_list[index].goods_num;
    var nums_all = nums - 1;
    if (nums <= 1) {
      return;
    } else {
      gets.getdatas("/api/order/edit", {
        "ac": "dec",
        "order_sn": order,
        "goods_id": goods_id,
        "goods_color_id":e.target.dataset.goodscolorid
      }, function (res) {
        if (res.code == 0) {
          that.setData({
            [deletedTodo]: nums_all,
          })
          let arr = wx.getStorageSync("buy_list")
          arr[0].list[index].goods_num = nums_all
          wx.setStorageSync("buy_list",arr)
        }
      })
    }
  },
  add: function (e) {
    let that = this;
    var index = e.target.dataset.cc; //index
    var order = this.data.buy_list[index].order_sn; //订单号
    var goods_id = this.data.buy_list[index].goods_id; //商品ID
    var deletedTodo = "buy_list[" + index + "].goods_num"; //当前商品数组位置
    var nums = that.data.buy_list[index].goods_num; //商品数量
    var nums_all = nums + 1; //商品加后的数量
    that.data.buy_list[index].goods_num++;
    gets.getdatas("/api/order/edit", {
      "ac": "inc",
      "order_sn": order,
      "goods_id": goods_id,
      "goods_color_id":e.target.dataset.goodscolorid
    }, function (res) {
      if (res.code == 0) {
        that.setData({
          [deletedTodo]: nums_all,
        })
        let arr = wx.getStorageSync("buy_list")
        arr[0].list[index].goods_num = nums_all
        wx.setStorageSync("buy_list",arr)
      }
    })
  },
  tests: function (e) {
    let that = this;
    var index = e.target.dataset.cc;
    var order = this.data.rent_list[index].order_sn;
    var goods_id = this.data.rent_list[index].goods_id;
    var deletedTodo = "rent_list[" + index + "].goods_num";
    var nums = that.data.rent_list[index].goods_num;
    var nums_all = nums - 1;
    if (nums <= 1) {

      return;
    } else {
      gets.getdatas("/api/order/edit", {
        "ac": "dec",
        "order_sn": order,
        "goods_id": goods_id,
        "goods_color_id":e.target.dataset.goodscolorid
      }, function (res) {
        if (res.code == 0) {
          that.setData({
            [deletedTodo]: nums_all,
          })
          let arr = wx.getStorageSync("buy_list")
          arr[0].list[index].goods_num = nums_all
          wx.setStorageSync("buy_list",arr)
        }
      })
    }
  },
  adds: function (e) {
    let that = this;
    var index = e.target.dataset.cc; //index
    var order = this.data.rent_list[index].order_sn; //订单号
    var goods_id = this.data.rent_list[index].goods_id; //商品ID
    var deletedTodo = "rent_list[" + index + "].goods_num"; //当前商品数组位置
    var nums = that.data.rent_list[index].goods_num; //商品数量
    var nums_all = nums + 1; //商品加后的数量
    that.data.rent_list[index].goods_num++;
    gets.getdatas("/api/order/edit", {
      "ac": "inc",
      "order_sn": order,
      "goods_id": goods_id,
      "goods_color_id":e.target.dataset.goodscolorid
    }, function (res) {
      if (res.code == 0) {
        that.setData({
          [deletedTodo]: nums_all,
        })
        let arr = wx.getStorageSync("buy_list")
        arr[0].list[index].goods_num = nums_all
        wx.setStorageSync("buy_list",arr)
      }
    })
  },
  //end
  //删除订单
  tang: function (e) {
    let that = this;
    let goods_id = e.target.id;
    let order = e.target.dataset.order
    let goodscol = e.target.dataset.goodscol
    wx.showModal({
      title: '确认要删除么',
      content: '',
      success: function (res) {
        if (res.confirm) {
          gets.getdatas("/api/order/del", {
            "order_sn": order,
            "goods_id": goods_id,
            "goods_color_id":goodscol
          }, function (res) {
            that.getAjax();
          })
        }
      }
    })
  },
  // 跳转到租赁结算
  zu_over: function () {
    wx.navigateTo({
      url: '../zu_over/zu_over?type=' + this.data.currentTab,
    })
  },
  // 确认收货
  notarize: function (e) {
    let that = this;
    let order = e.target.dataset.order;
    gets.getdatas("/api/order/receiving_confirm", {
      "order_sn": order
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '收货成功',
          duration:1500,
          success: function () {
            that.setData({
              currentNum: 2,
            })
          }
        })
        that.getAjax();
      } else {
        let msg = res.msg;
        wx.showToast({
          title: msg,
          duration: 1500,
          icon: "none"
        })
      }
    })
  },
  //查看物流
  see: function (e) {
    let order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '../see_k/see_k?order=' + order,
    })

  },
  // 申请还表
  give_back: function (e) {
    let order = e.currentTarget.dataset.order;
    let id = e.currentTarget.dataset.id;
    let goods_color_id = e.currentTarget.dataset.colid;
    let backs = e.currentTarget.dataset.back;
    if (backs == false) {
      wx.navigateTo({
        url: '../give_back/give_back?order=' + order + "&id=" + id + "&colid=" + goods_color_id
      })
    } else {
      wx.showToast({
        title: '已申请还表...',
        icon:"none",
        duration:1000
      })
    }
  },
  // 我要买断
  want_buy: function (e) {
    let buyoutlist = e.currentTarget.dataset.buyoutlist
    this.setData({
      buy_out:true,
      goods_num:1,
      maxgoods_num:buyoutlist.goods_num - buyoutlist.buy_num,
      buyoutlist:buyoutlist
    })
    // 分两次传数据,为了拿到goods_num
    this.calculate()
  },
  close_buy: function()  {
    this.setData({
      buy_out:false
    })
  },
  no_see: function () {
    wx.showToast({
      title: '抱歉，该订单还未发货！',
      duration: 1500,
      icon: "none"
    })
  },
  // 订单详情页面
  xiang: function (e) {
    var order = e.currentTarget.dataset.orders;
    wx.navigateTo({
      url: '../line/line_item?order=' + order
    })
  },
  // 获取ajax信息
  getAjax: function () {
    let that = this
    let resz
    let buyz
    let arr = []
    let arrTime = []
    let temparr = []
    clearInterval(timer)
    gets.getdatas("/api/order/get", {}, function (res) {
      // 循环,把有时间限制的拿出来
      if (res.data.rent_list.length > 0) {
        res.data.rent_list[0].list.forEach(item => {
          if (item.activity) {
            if (item.activity.end_time != 0) {
              arrTime.push(item.activity.end_time)
            }
          } else {
            arrTime.push(0)
          }
        })
      }
      if (res.data.rent_list.length != 0) {
        resz = res.data.rent_list[0].list
      } else {
        resz = res.data.rent_list
      }
      if (res.data.buy_list.length != 0) {
        buyz = res.data.buy_list[0].list
      } else {
        buyz = res.data.buy_list
      }
      // 制造开关数量
      for (let a = 0; a < res.data.back_list.length; a++) {
        for (let b = 0; b < res.data.back_list[a].list.length; b++) {
          arr.push(res.data.back_list[a].list[b]);
          that.setData({
            ["ds[" + a + "][" + b + "]"]: false,
            ["dx[" + a + "][" + b + "]"]: 0,
          })
        }
      }
      let sign_list = []
      if (res.data.sign_list.length != 0) {
        res.data.sign_list.forEach(item => {
          if (item.order_type == that.data.currentTab) {
            sign_list.push(item)
            that.setData({
              sign_list: sign_list
            })
          }
        })
      } else {
        that.setData({
          sign_list: res.data.sign_list
        })
      }
      // 计算时间
      timer = setInterval(() => {
        arrTime.forEach((item, index) => {
          if (item != 0) {
            item--
          }
          arrTime.splice(index, 1,item)
          temparr.splice(index, 1,that.timeStamp(item))
          that.setData({
            arrTime: temparr
          })
        })
      }, 1000)
      
      that.setData({
        rent_list: resz,
        buy_list: buyz,
        back_list: res.data.back_list,
        mymoney:res.money
      })
      wx.setStorageSync("mymoney",res.money)
      if (that.data.currentTab == 1) {
        wx.setStorageSync("buy_list",res.data.rent_list)
      } else {
        wx.setStorageSync("buy_list",res.data.buy_list)
      }
    })
  },

  // 时间换算
  timeStamp: function(second_time) {
    var time = parseInt(second_time)
    if (parseInt(second_time) > 60) {
      var second = second_time % 60
      var min = parseInt(second_time / 60)
      time = (min < 10 ? '0' + min : min) + ":" + (second < 10 ? '0' + second : second)

      if (min > 60) {
        min = parseInt(second_time / 60) % 60
        var hour = parseInt(parseInt(second_time / 60) / 60)
        time = (hour < 10 ? '0' + hour : hour) + ":" + (min < 10 ? '0' + min : min) + ":" + (second < 10 ? '0' + second : second)
      }
    }
    return time
  },
  gethistoryList: function () {
    let that = this
    gets.getdatas("/api/order/history", {
      page: 1,
      type: that.data.currentTab
    }, function (res) {
      that.setData({
        historyList: res.data.data
      })
    })
  },
  // 点击购买结算
  buy_over: function () {
    let id = this.address_id;
    wx.navigateTo({
      url: '../zu_over/zu_over?type=' + this.data.currentTab,
    })
  },
  goweb: function (e) {
    let goodid = e.currentTarget.dataset.goodsid
    let order = e.currentTarget.dataset.order
    if (e.currentTarget.dataset.str === '查看评价') {
      wx.navigateTo({
        url: '../ping_x/ping_x?id=' + goodid + '&order=' + order
      })
    } else {
      wx.navigateTo({
        url: '../discuss_details/discuss_details?id=' + goodid + '&order=' + order
      })
    }
  },
  onLoad: function (options) {
    let index = options.type;
    let historyinx = parseInt(index) + 1;
    this.setData({
      currentTab: index,
      currentNum: 0,
      historyinx: historyinx
    })
    this.gethistoryList();
  },
  history: function () {
    wx.navigateTo({
      url: '../history/history?type=1',
    })
  },
  historys: function () {
    wx.navigateTo({
      url: '../history/history?type=2',
    })
  },
  onShow: function () {
    this.getAjax()
    token = wx.getStorageSync("token");
  },
  zcv: function (e) {
    let a = e.currentTarget.dataset.id;
    let b = e.currentTarget.dataset.ids;
    let bian = !this.data.ds[a][b]
    this.setData({
      ["ds[" + a + "][" + b + "]"]: bian,
    })
  },
  // 续租
  reletPickerChange: function(e) {
    let that = this
    this.setData({
      price_listIndex:parseInt(e.detail.value)
    })
    wx.showModal({
      title:"您选择续租"+e.currentTarget.dataset.reletpricelist[parseInt(that.data.price_listIndex)].name,
      content:"亲，只有一次续租机会哦，请谨慎选择时间。",
      success:function(res) {
        if (res.confirm) {
          gets.getdatas("/api/order/pay_relet",{
            order_sn:e.currentTarget.dataset.ordersn,
            pay_name:"xcx",
            device_info:"13131313131",
            goods_id:e.currentTarget.dataset.gid,
            rent_price_id:e.currentTarget.dataset.reletpricelist[parseInt(that.data.price_listIndex)].rent_price_id,
            goods_color_id:e.currentTarget.dataset.colorid
          },function(res) {
            if (res.code != 0) {
              wx.showToast({
                title: '续租失败,请重试',
                duration: 1000,
                success:function() {
                  that.getAjax();
                }
              })
              return false
            }
            if (res.data.length != 0) {
              var obj = res.data.jsApiParameters;
              let nonceStr = obj.nonceStr;
              let packages = obj.package;
              let paySign = obj.paySign;
              let signType = obj.signType;
              let timeStamp = obj.timeStamp;
              wx.requestPayment({
                timeStamp: timeStamp,
                nonceStr: nonceStr,
                package: packages,
                signType: signType,
                paySign: paySign,
                success: function (res) {
                  wx.showToast({
                    title: '续租成功',
                    duration: 1000,
                    success:function() {
                      that.getAjax();
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '续租成功',
                duration: 1000,
                success:function() {
                  that.getAjax();
                }
              })
            }
          })
        }
      }
    })
    
  },
  onUnload:function() {
    wx.removeStorageSync("mymoney")
    wx.removeStorageSync("buy_list")
    clearInterval(timer)
  },
  onHide: function() {
    clearInterval(timer)
  },
  // 计算实付价格
  calculate:function() {
    // 判断是否逾期
    if (this.data.buyoutlist.give_back_days < 0) {
      this.setData({
        goods_price:this.data.buyoutlist.goods_price * this.data.goods_num,
        pledge_price:this.data.buyoutlist.pledge_price * this.data.goods_num,
        rent_price:this.data.buyoutlist.rent_price * this.data.goods_num - this.data.buyoutlist.coupon_price,
        cope_price:(this.data.buyoutlist.goods_price* this.data.goods_num) - (this.data.buyoutlist.pledge_price* this.data.goods_num),
        outofpocket:this.data.mymoney - ((this.data.buyoutlist.goods_price* this.data.goods_num) - (this.data.buyoutlist.pledge_price* this.data.goods_num))
      })
    } else {
      this.setData({
        goods_price:this.data.buyoutlist.goods_price * this.data.goods_num,
        pledge_price:this.data.buyoutlist.pledge_price * this.data.goods_num,
        rent_price:this.data.buyoutlist.rent_price * this.data.goods_num - this.data.buyoutlist.coupon_price,
        cope_price:(this.data.buyoutlist.goods_price* this.data.goods_num) - (this.data.buyoutlist.pledge_price* this.data.goods_num) - (this.data.buyoutlist.rent_price * this.data.goods_num - this.data.buyoutlist.coupon_price),
        outofpocket:this.data.mymoney - ((this.data.buyoutlist.goods_price* this.data.goods_num) - (this.data.buyoutlist.pledge_price* this.data.goods_num) - (this.data.buyoutlist.rent_price * this.data.goods_num - this.data.buyoutlist.coupon_price))
      })
    }
  },
  // 数量减号
  subtract:function() {
    let goods_num = this.data.goods_num - 1
    if (goods_num <= 0) {
      goods_num = 1
    }
    this.setData({
      goods_num:goods_num
    })
    this.calculate()
  },
  //数量加号
  addbuy_over:function() {
    let goods_num = this.data.goods_num + 1
    if (goods_num > this.data.maxgoods_num) {
      goods_num = this.data.maxgoods_num
    }
    this.setData({
      goods_num:goods_num
    })
    this.calculate()
  },
  // 确认支付买断
  confirm:function() {
    let that = this
    wx.showModal({
      title:"提示",
      content:"是否买断该商品",
      success:function(res) {
        if (res.cancel) {
          return false
        }
        gets.getdatas("/api/order/rent_to_buy",{
          order_sn:that.data.buyoutlist.order_sn,
          goods_id:that.data.buyoutlist.goods_id,
          goods_num:that.data.goods_num,
          pay_price:that.data.outofpocket < 0 ? that.data.outofpocket * -1 : 0,
          goods_color_id:that.data.buyoutlist.goods_color_id
        },function(res) {
          if (res.data.length != 0 && res.code == 0) {
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
                that.setData({
                  buy_out:false,
                  currentTab:2,
                  currentNum:2
                })
                that.gethistoryList()
              }
            })
          } else {
            if (res.code == 0) {
              wx.showToast({
                title:"支付成功",
                icon:"none",
                mask:true,
                duration:1500,
                success:function() {
                  that.setData({
                    buy_out:false,
                    currentTab:2,
                    currentNum:2
                  })
                  that.gethistoryList()
                }
              })
            } else {
              wx.showToast({
                title:"支付失败,请重试或联系客服",
                icon:"none",
                mask:true,
                duration:1500
              })
            }
          }
        })
      }
    })
  }
})