var gets = require('../../utils/util.js')
var token = wx.getStorageSync("token")
const app = getApp()
var topsz;
Page({
  data: {
    imgUrls: [],
    userInfo: {},
    hots: [],
    news: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    shai: "0",
    topc: false,
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
    page: 1,
    item_State: "",
    shai_items:[],
    pageSize:10,
    brandHeight:"",
    vip_tips_show: false
  },
  faxian: function () {
    wx.navigateTo({
      url: '../fabu_fa/fabu_fa',
    })
  },
  jump_new: function () {
    wx.navigateTo({
      url: '../new/new?type=1',
    })
  },
  navGo: function (e) {
    let linkID = e.currentTarget.dataset.id
    let keyword = e.currentTarget.dataset.keyword
    
    if (linkID && e.currentTarget.dataset.url != "h5") {
      if (linkID == 8) {
        wx.navigateTo({
          url: "../topic/topic" + "?id=" + linkID
        })
      } else {
        wx.navigateTo({
          url: "../choimmer/choimmer" + "?id=" + linkID
        })
      }
    } else if (keyword) {
      if (e.currentTarget.dataset.url == "goods_new") {
        wx.navigateTo({
          url: "../new/new?keyword="+keyword
        })
      }
    } else {
      if (e.currentTarget.dataset.url == "goods") {
        wx.switchTab({
          url: "../index/index"
        })
      } else if (e.currentTarget.dataset.url == "h5") {
        wx.navigateTo({
          url: "../test/test?link=" + e.currentTarget.dataset.url + '/' + e.currentTarget.dataset.urlone + '&id=' + e.currentTarget.dataset.id
        })
      } else if (e.currentTarget.dataset.url == "Popout") {
        this.setData({
          vip_tips_show: true
        })
      } else {
        this.setData({
          currentTab:2
        })
      }
    }
  },
  // 保存FormId
  saveFormId :function(e, type, cb) {
    let formId = e.detail.formId
    if (!formId) return
    if (formId == 'the formId is a mock one') {
      console.log('调试模式，获得真实有效的 formId 需要在真机上运行')
    } else {
      wx.showLoading({
        title: '正在加载',
        mask: true,
      })
      gets.getdatas('/api/xcx/saveFormId', {
        id: formId,
        type: e.type == 'submit' ? 1 : 2
      }, function (res) {
        let link = e.detail.target.dataset.api_link
        if (link) {
          gets.getdatas('/api/'+link,{},function(res) {
            wx.showToast({
              title:res.msg,
              icon:'none',
              duration:1000,
              mask:true
            })
          })
        }
      })
    }
  },
  hot_goods: function (e) {
    wx.navigateTo({
      url: "../choimmer/choimmer" + "?id=" + e.currentTarget.dataset.id
    })
  },
  newsGoods: function (e) {
    wx.navigateTo({
      url: "../choimmer/choimmer" + "?id=" + e.currentTarget.dataset.id
    })
  },
  startsInfo: function (e) {
    wx.navigateTo({
      url: "../start/start" + "?num=" + e.currentTarget.dataset.index
    })
  },
  Allhot: function () {
    wx.navigateTo({
      url: "../hot/hot?typs=1"
    })
  },
  Allnew: function () {
    wx.navigateTo({
      url: "../new/new?type=1"
    })
  },
  handpickInfo: function (e) {
    wx.navigateTo({
      url: "../topic/topic" + "?id=" + e.currentTarget.dataset.id
    })
  },
  back: function () {
    var that = this;
    that.setData({
      scolltop: 0
    })
  },
  scroll: function (e) { 
    let that = this;
    topsz = e.detail.scrollTop;
    if (topsz >= that.data.clientHeight) {
      that.setData({
        topc: true
      })
    } else {
      that.setData({
        topc: false
      })
    }
  },
  brands: function () {
    wx.navigateTo({
      url: '../brands/brands',
    })
  },
  onShareAppMessage: function(res) {
    let shareCode = wx.getStorageSync("share_code")
    let that = this;
    return {
      title: '超好玩的租赁平台,赶快来加入吧',
      path: '/pages/Home/home?type='+that.data.currentTab+'&shareCode='+shareCode,
      success: function (res) { 
        // 转发成功
        wx.showToast({
          title: '转发成功',
          duration:1000
        })
      }
    }
  },
  // 放大图片
  tapimg: function (e) {
    var arr = []
    e.currentTarget.dataset.arr.forEach(function(item) {
      arr.push(item.file)
    })
    
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  // 整体的request
  ajax: function () {
    var that = this
    gets.getdatas("/api/index/getInitList", {}, function (res) {
      let pushArr = res.push_list.splice(parseInt(Math.random()), parseInt(Math.random() * 3));
      let hot_width = res.brand_hot_list.length * 520
      that.setData({
        nick: pushArr || [],
        numlen: pushArr.length || 0,
        imgUrls: res.ad_list[1] || [],
        hots: res.hot_list || [],
        news: res.new_list || [],
        starts: res.star_list || [],
        topic: res.topic_list || [],
        buttonImg: res.ad_list[2] || [],
        new_list:res.brand_new_list || [],
        hot_list:res.brand_hot_list || [],
        hot_width:hot_width,
        brand_list:res.brand_search_list || [],
        cheap_list:res.ad_list[5] || []
      })
      // 首页动画
      var animation = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease'
      })
      var height;
      setTimeout(() => {
        wx.createSelectorQuery().selectAll('.mgs_id').boundingClientRect(function (rects) {
          rects.forEach(function (item) {
            height = item.height + (item.height / 3.5)
          })
        }).exec()
      }, 2000)
      that.animation = animation;
      that.setData({
        animationData: animation.export()
      })
      var tag = 0;
      var number = 0
      var timer = setInterval(function () {
        tag = tag - height
        animation.translateY(tag).step()
        number = number + 1
        that.setData({
          animationData: animation.export()
        })
        let num = parseInt(pushArr.length)
        if (number >= num) {
          clearInterval(timer)
        }
        if (height === undefined) {
          clearInterval(timer)
        }
      }.bind(that), 4000)
    })
  },
  // 跳转到热租
  go_hot: function () {
    wx.navigateTo({
      url: '../hot/hot?typs=1',
    })
  },
  jump_brand: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../brand/brand?id=' + id,
    })
  },
  // 发现晒单切换
  huang: function (e) {
    let shai = e.currentTarget.dataset.shai;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    this.setData({
      shai: shai,
      page: 1,
      scolltop: 0,
      item_State: false
    })
    this.getshai();
  },
  jump: function (e) {
    let id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: '../choimmer/choimmer?id=' + id,
      })
    }
  },
  start_jump: function (e) {
    let num = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../start/start?num=' + num,
    })
  },
  // 专题跳转
  zxc: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../topic/topic?id=' + id,
    })
  },
  // 滑动滑块
  change: function (e) {
    this.setData({
      currentTab: e.detail.current
    })
  },
  // 点击改变滑块
  swichNav: function (e) {
    let that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  jumps: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.params;
    let params = e.currentTarget.dataset.m;
    if (id == undefined && params == "goods") {
      wx.redirectTo({
        url: '../index/index',
      })
    }
    if (id != undefined && params == "goods") {
      wx.navigateTo({
        url: '../choimmer/choimmer?id=' + id,
      })
    }
    if (id != undefined && params == "brand") {
      wx.navigateTo({
        url: '../brand/brand?id=' + id,
      })
    }
    if (id == undefined && params == "brand") {
      that.setData({
        currentTab: 2,
      })
    }
    if (id != undefined && params == "goods_new") {
      wx.navigateTo({
        url: '../new/new?keyword?=' + id,
      })
    }
    if (id != undefined && params == "goods_hot") {
      wx.navigateTo({
        url: '../hot/hot?keyword?=' + id,
      })
    }
  },
  // 晒单
  getshai: function () {
    let that = this;
    let arr = [];
    let shai = this.data.shai;
    let item_State = that.data.item_State;
    let page = that.data.page;
    let searchList = [];
    let pageSize = that.data.pageSize
    if (shai == "0") {
      gets.getdatas("/api/comment/get", {
        "page": page,
        "pageSize":10,
        "is_img":1
      }, function (res) {
        if (res.data.data.length == 0) {
          that.setData({
            total:that.data.shai_items.length
          })
        }
        wx.hideLoading()
        if (item_State == false) {
          searchList = res.data.data;
          that.setData({
            shai_items: searchList,
          })
        } else {
          if (res.data.data != 0) {
            that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.shai_items.concat(res.data.data)
            that.setData({
              shai_items: searchList,
            })
          }
        }
        
      })
    } else {
      gets.getdatas("/api/discover/get", {
        "page": page,
        "pageSize":10
      }, function (res) {
        that.setData({
          total:res.data.total
        })
        wx.hideLoading()
        if (item_State == false) {
          searchList = res.data.data;
          that.setData({
            shai_items: searchList
          })
        } else {
          if (res.data.data.length != 0) {
            that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.shai_items.concat(res.data.data)
            that.setData({
              shai_items: searchList,
            })
          }
        }
      })
    }
  },
  // 滑动到底部
  bottomscroll: function () {
    let that = this;
    let item_State = that.data.item_State;
    let page = that.data.page
    let shai = this.data.shai;
    if (that.data.total == that.data.shai_items.length) {
      wx.showToast({
        title:"没有更多数据",
        icon:"none",
        duration:1000
      })
      return false
    }
    if (shai == "0") {
      wx.showLoading({
        title: '正在加载',
        mask:true
      })
      if (that.data.total != that.data.shai_items.length) {
        that.setData({
          page: page + 1,
          isFromSearch: false,
          item_State: true,
        })
        that.getshai();
      }
    } else {
      wx.showLoading({
        title: '正在加载',
        mask:true
      })
      if (that.data.total != that.data.shai_items.length) {
        that.setData({
          page: page + 1,
          isFromSearch: false,
          item_State: true,
        })
        that.getshai();
      }
    }
  },
  // 跳转发现详情
  jump_x: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../fa_x/fa_x?id=' + id,
    })
  },
  // 发现点赞
  fazan: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let shai = this.data.shai;
    let page = this.data.page
    if (shai == "0") {
      gets.getdatas("/api/comment/addLike", {
        "comment_id": id
      }, function (res) {
        if (res.code == 0) {
          that.setData({
            page:1,
            pageSize:that.data.shai_items.length
          })
          gets.getdatas("/api/comment/get", {
            "page": 1,
            "pageSize":that.data.pageSize
          }, function (res) {
            that.setData({
              shai_items:res.data.data
            })
          })
        }
      })
    } else {
      gets.getdatas("/api/discover/addLike", {
        "id": id
      }, function (res) {
        if (res.code == 0) {
          that.setData({
            page:1,
            pageSize:that.data.shai_items.length
          })
          gets.getdatas("/api/discover/get", {
            "page": 1,
            "pageSize":that.data.pageSize
          }, function (res) {
            that.setData({
              shai_items:res.data.data
            })
          })
        }
      })
    }


  },
  // 跳转到品牌详情
  brand_jumps: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../brand/brand?id=' + id,
    })
  },
  onLoad: function(p) {
    let that = this
    // 判断是哪个页面分享的
    if (p.type) {
      this.setData({
        currentTab:p.type
      })
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })

    // 获取邀请码参数
    gets.get_res(p, app, () => {
      this.ajax()
      this.getshai()
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            screenHeight: res.screenHeight
          })
        }
      })
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight
          });
        }
      })
      app.mta.Page.init()
    })

  },
  onShow: function () {
    let that = this;
    token = wx.getStorageSync("token")
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.screenHeight - 130
        })
      },
    })
    this.gettimes()
  },
  // 热租随机商品
  gettimes: function() {
    let date = new Date();
    let nowtime = date.getTime();
    let oldtime = wx.getStorageSync("oldtime")
    if (oldtime == 0 || nowtime - oldtime > 60000) {
      wx.setStorageSync("oldtime",nowtime)
      this.setData({
        hots:this.data.hots.sort(randomsort)
      })
    }
    function randomsort(a, b) {
      return Math.random()>.5 ? -1 : 1;
      //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    }
  },
  hideVipTips: function() {
    this.setData({
      vip_tips_show: false
    })
  }
})