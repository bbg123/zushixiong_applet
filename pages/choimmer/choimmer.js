var gets = require('../../utils/util.js')
var token = wx.getStorageSync("token")
const app = getApp()
let topsz
var ti
Page({
  data: {
    id: "",
    topc: false,
    like_img: "../img/like@2x.png",
    like_chang: false,
    collect_img: "../icon/money.png",
    collect_chang: false,
    like_count: "",
    play: false, //购买弹出窗判断条件
    currentItemId: "1", //设置默认的id,用做改变样式用
    moneyId: "1", //选定购买价钱的index
    img_id: "0", //选定小图的index
    img_srcs: "", //小图的总数
    img_src: "", //选定当前的小图src
    zus: false, //租赁弹出窗判断条件
    zuli: "1", //租赁价钱的id
    touchs: "1",
    top: "false", //头部的nav一开始隐藏
    animationData: {}, //动画
    top_mg: true,
    praise_rate: 0,
    ping_items: [],
    mask_layer: false,
    phone: "",
    coupons: false //领卷弹出框
  },
  // 获取高度
  gettop: function () {
    let that = this;
    let arr = [];
    var query = wx.createSelectorQuery(); //节点选择器
    query.select('#top_img').boundingClientRect()
    query.select('#pingl').boundingClientRect()
    query.select('#xiang').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      for (let a = 0; a < res.length; a++) {
        arr.push(res[a].top - 50);
      }
    })
    that.setData({
      scoll_arr: arr,
    })
  },
  tapbrand: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../brand/brand?id=' + id
    })
  },
  getajax: function () {
    let that = this;
    let id = that.data.id;
    let arrc = [];
    clearInterval(ti)
    let new_arr = [{
      "nickname": " "
    }]
    gets.getdatas("/api/goods/info", {
      goods_id: id
    }, function (res) {
      let zuli = res.data.rent_price_list[0].rent_price_id
      let a = res.data.goods_content;
      let b = /<img[^>]+src=['"]([^'"]+)['"]+/g;
      var s = a.match(b);
      var result = [],
        temp;
      arrc.push(res.data.brand)
      while ((temp = b.exec(a)) != null) {
        result.push(temp[1]);
      }
      var dd = [];
      var zz = [];
      var arr = "https://www.zushixiong.com"
      for (let a = 0; a < result.length; a++) {
        if (result[a].substr(0, 7).toLowerCase() == "http://") {
          zz.push(result[a])
        } else {
          zz.push(arr + result[a])
        }
        dd.push(result[a])
      }
      if (res.data.is_like == true) {
        that.setData({
          like_img: "../img/like2@2x.png",
          like_chang: true
        })
      }
      if (res.data.is_collect == true) {
        that.setData({
          collect_img: "../img/xin7.png",
          collect_chang: true
        })
      }
      for (let a = 0; a < res.data.push_list.length; a++) {
        new_arr.push(res.data.push_list[a])
      }
      let color_list
      for (let i = 0; i < res.data.color_list.length; i++) {
        if (res.data.color_list[i].store_count != 0) {
          color_list = res.data.color_list[i]
          break;
        } else {
          color_list = res.data.color_list[i]
        }
      }
      that.setData({
        allStore_count: res.data.store_count,
        store_count: color_list.store_count,
        headerimg: res.data.goods_imgs,
        name: res.data.goods_name,
        rent_rent_price_section: res.data.rent_price_section,
        rent_day: res.data.rent_day,
        market_price: res.data.market_price,
        shop_price: res.data.shop_price,
        moneyId: res.data.shop_price,
        goods_remark: res.data.goods_remark,
        total: res.data.total,
        like_count: res.data.like_count,
        goods_content: res.data.goods_content,
        imgs: zz,
        color_list: res.data.color_list,
        currentItemId: color_list.color_id,
        img_srcs: res.data.color_list,
        img_src: color_list.img,
        rent_pay: res.data.rent_price_list,
        zuli: zuli,
        brand_items: arrc,
        nick: new_arr,
        length: new_arr.length,
        coupon_list: res.data.coupon_list,
      })
    })
    var time1 = setTimeout(function () {
      that.anim()
      clearTimeout(time1)
    }, 4000)
  },
  // 品牌关注
  brand_g: function (e) {
    var animation = wx.createAnimation({
      duration: 1,
      timingFunction: 'ease',
    })
    let brand = e.currentTarget.dataset.brand;
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (brand == false) {
      gets.getdatas("/api/brand/add_collect", {
        "id": id,
        "collect": "1"
      }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '关注成功',
            duration: 1000,
            success: function (res) {
              that.getajax();
              animation.translateY(0).step()
              that.setData({
                animationData: animation.export()
              })
            }
          })
        }
      })
    } else {
      gets.getdatas("/api/brand/add_collect", {
        "id": id,
        "collect": "0"
      }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '取消关注成功',
            duration: 1000,
            success: function (res) {
              that.getajax();
              animation.translateY(0).step()
              that.setData({
                animationData: animation.export()
              })
            }
          })
        }
      })
    }
  },
  goreview: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../review/review?id=' + id
    })
  },
  // 收藏
  change: function () {
    var that = this;
    let id = that.data.id;
    let switchs = that.data.collect_chang;
    if (token) {
      if (switchs == false) {
        gets.getdatas("/api/goods_collect/add", {
          goods_id: id
        }, function (res) {
          if (res.code == 0) {
            wx.showToast({
              title: '收藏成功',
              duration: 1000
            })
            that.setData({
              collect_chang: true,
              collect_img: "../img/xin7.png"
            })
          } else {
            let msg = res.msg;
            wx.showToast({
              title: msg,
              duration: 1000
            })
          }
        })
      } else {
        gets.getdatas("/api/goods_collect/del", {
          goods_id: id
        }, function (res) {
          that.setData({
            collect_chang: false,
            collect_img: "../icon/money.png"
          })
        })
      }
    }
  },
  imgs: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  },
  // 获取评论数据
  getping: function () {
    let that = this;
    let goods_id = this.data.id;
    gets.getdatas("/api/comment/get", {
      "goods_id": goods_id,
      "is_img": 0
    }, function (res) {
      if (res.data.total != 0) {
        that.setData({
          ping_items: res.data.data.splice(0, 5),
          praise_rate: res.data.praise_rate,
          totalnum: res.data.total
        })
      }
    })
  },
  // 点击购买
  buy_s: function (e) {
    let that = this;
    that.setData({
      touchs: "2"
    })
    if (token) {
      let id = that.data.id;
      let rent_price_id = that.data.zuli;
      let color_id = that.data.currentItemId;
      gets.getdatas("/api/order/add", {
        "goods_id": id,
        "type": 2,
        "rent_price_id": rent_price_id,
        "color_id": color_id,
      }, function (res) {
        that.setData({
          touchs: "1",
        })
        wx.navigateTo({
          url: "../order/order?type=2"
        })
      })
    }
  },
  // 点击租赁
  zu_s: function () {
    let that = this;
    if (token) {
      this.setData({
        touchs: "2"
      })
      let id = that.data.id;
      let rent_price_id = that.data.zuli;
      let color_id = that.data.currentItemId;
      gets.getdatas("/api/order/add", {
        "goods_id": id,
        "type": 1,
        "rent_price_id": rent_price_id,
        "color_id": color_id,
      }, function (res) {
        that.setData({
          touchs: "1"
        })
        wx.navigateTo({
          url: "../order/order?type=1"
        })
      })
    }
  },
  // 弹出到货通知
  setArrivalNotice: function () {
    if (this.data.allStore_count > 0) {
      this.setData({
        mask_layer: true,
        play: true,
      })
    } else {
      this.setData({
        mask_layer: true
      })
    }
  },
  // 关闭模态框
  closePopup_frame: function () {
    if (this.data.allStore_count > 0) {
      this.setData({
        mask_layer: false,
        play: true,
      })
    } else {
      this.setData({
        mask_layer: false
      })
    }
  },
  // 点击改变颜色的样式
  aa: function (e) {
    let img_srcs = this.data.img_srcs;
    let index = e.target.id
    let color_id = e.target.dataset.num
    var img_src = img_srcs[index].img;
    this.setData({
      currentItemId: e.currentTarget.dataset.num,
      img_id: e.target.id,
      img_src: img_src,
      store_count: parseInt(e.target.dataset.store),
      color_id: color_id
    })
  },
  // 放大评论照片
  bigsee: function (e) {
    let arr = [];
    let src = e.currentTarget.dataset.src;
    arr.push(src)
    wx.previewImage({
      urls: arr,
    })
  },
  // 点赞评论
  ping_like: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    gets.getdatas("/api/comment/addLike", {
      "comment_id": id
    }, function (res) {
      let msg = res.msg;
      if (res.code == 0) {
        wx.showToast({
          title: msg,
          duration: 1000
        })
      } else {
        wx.showToast({
          title: msg,
          duration: 1000
        })
      }
      that.getping();
    })
  },
  // 点击改变租赁价钱样式的方法
  money: function (e) {
    let index = e.target.dataset.sent
    this.setData({
      zuli: index,
    })
  },
  bb: function (e) {},
  // 点赞
  likes: function () {
    var that = this;
    let id = that.data.id;
    let switc = that.data.like_chang;
    let like_count = that.data.like_count;
    if (token) {
      if (switc == false) {
        gets.getdatas("/api/goods/addLike", {
          goods_id: id
        }, function (res) {
          if (res.code == 0) {
            that.setData({
              like_img: "../img/like2@2x.png",
              like_chang: true,
              like_count: like_count + 1
            })
          }
        })
      } else {
        gets.getdatas("/api/goods/addLike", {
          goods_id: id
        }, function (res) {
          that.setData({
            like_img: "../img/like@2x.png",
            like_chang: false,
            like_count: like_count - 1
          })
        })
      }
    }
  },
  quxiao: function () {
    this.setData({
      play: false,
      zus: false,
      coupons: false
    })
  },
  buy: function () {
    this.setData({
      play: true,
    })
  },
  goH: function () {
    wx.switchTab({
      url: '../Home/home'
    })
  },
  // 点击头部nav改变滚动条位置
  goods: function (e) {
    let arr = this.data.scoll_arr;
    let index = e.currentTarget.dataset.index;
    let scroll = arr[index] + 2;
    this.setData({
      scolltop: scroll,
      scroll_type: index,
    })
  },
  scroll: function (e) {
    let that = this;
    let arr = this.data.scoll_arr;
    topsz = e.detail.scrollTop
    let top1 = arr[0];
    let top2 = arr[1];
    let top3 = arr[2];
    if (top1 <= topsz && topsz < top2) {
      that.setData({
        scroll_type: 0
      })
    }
    if (top2 <= topsz && topsz < top3) {
      that.setData({
        scroll_type: 1
      })
    }
    if (topsz >= top3) {
      that.setData({
        scroll_type: 2
      })
    }
    if (topsz >= 300) {
      that.setData({
        top: false
      })
    } else {
      that.setData({
        top: true
      })
    }
    if (topsz >= 1800) {
      that.setData({
        topc: true
      })
    } else {
      that.setData({
        topc: false
      })
    }
  },
  back: function () {
    var that = this;
    that.setData({
      scolltop: 0
    })
  },
  // 租赁的出现和消失
  qu: function () {
    this.setData({
      zus: false,
    })
  },
  // 获取输入的手机号
  phoneInput: function (event) {
    this.setData({
      phone: event.detail.value
    })
  },
  // 设置手机到货通知
  confirmPhone: function () {
    let that = this
    let phone = this.data.phone
    if (phone.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    gets.getdatas("/api/goods/add_goods_notice", {
      goods_id: this.data.id,
      color_id: this.data.color_id,
      mobile: phone
    }, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 1500
      })
      that.setData({
        mask_layer: false,
        play: true,
      })
    })

  },
  zu_a: function () {
    this.setData({
      zus: true,
    })
  },
  sees: function (e) {
    let index = e.currentTarget.dataset.src;
    let srcs = this.data.headerimg;
    let arr = [];
    for (let a = 0; a < srcs.length; a++) {
      arr.push(srcs[a]);
    }
    wx.previewImage({
      current: index,
      urls: arr,
    })
  },
  // 轮播动画
  anim: function () {
    let that = this
    let screenHeight = this.data.screenHeight;
    var height = screenHeight * 0.09;
    let length = this.data.length;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    var dd = 0;
    var cc = 0;
    ti = setInterval(function () {
      cc = cc + 1;
      if (cc <= length) {
        dd = dd - height
        animation.translateY(dd).step()
        this.setData({
          animationData: animation.export()
        })
      } else {
        clearInterval(ti)
        that.setData({
          top_mg: !that.data.top_mg
        })
      }

    }.bind(this), 5000)
  },
  onShareAppMessage: function (res) {
    let that = this;
    let shareCode = wx.getStorageSync("share_code")
    let id = that.data.id;
    return {
      title: '超好玩的租赁平台,赶快来加入吧',
      path: '/pages/choimmer/choimmer?id=' + id + '&shareCode=' + shareCode,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          duration: 1000
        })
      }
    }
  },

  onLoad: function (p) {
    let that = this
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })

    // 获取邀请码参数
    gets.get_res(p, app, () => {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight
          });
        }
      });
      app.mta.Page.init()
      var id = p.id
      that.setData({
        id: id,
      })
      this.setData({
        touchs: 1,
      })
      this.getping()
      this.getajax()
    })

  },
  onShow: function () {
    let that = this
    var time2 = setTimeout(function () {
      that.setData({
        top_mg: !that.data.top_mg
      })
      clearTimeout(time2)
    }, 2000)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
  },
  onReady: function () {
    var time3 = setTimeout(() => {
      this.gettop()
      clearTimeout(time3)
    }, 1000)
  },
  onUnload: function () {
    clearInterval(ti)
  },
  onHide: function () {
    clearInterval(ti)
  },
  // 打开优惠劵弹框
  getCoupons: function () {
    this.setData({
      coupons: true
    })
  },
  // 领取优惠劵
  getroll: function (e) {
    let that = this
    if (e.currentTarget.dataset.isget == 0) {
      gets.getdatas("/api/coupon/add", {
        'id': e.currentTarget.dataset.id
      }, function () {
        wx.showToast({
          title: '领取成功',
          mask: true,
          duration: 1500
        })
        that.getajax()
      })
    } else {
      wx.showToast({
        title: '无法领取',
        mask: true,
        icon: "none",
        duration: 1000
      })
    }
  }
})