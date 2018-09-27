var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
    keyword: "全部",
    page: 1,
    pageSize:20,
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
    item_State: true,
    d: [],
    topsc: 0,
    wordinx: 0,
    imgheight: 0,
    headheight: 0,
    top: 0
  },
  getajax: function () {
    let that = this;
    let word = this.data.keyword;
    let searchList = [];
    let page = that.data.page;
    let item_State = that.data.item_State;
    gets.getdatas("/api/goods/new_list", {
      "page": page,
      "keyword": word,
    }, function (res) {
      wx.hideLoading()
      that.setData({
        searchList: res.data.search,
        total:res.data.total
      })
      res.data.search.forEach((item,index) => {
        if (that.data.keyword == item) {
          that.setData({
            wordinx: index
          })
        }
      })
      if (item_State == false) {
        searchList = res.data.data;
        for (let i = 0; i < searchList.length; i++) {
          if (searchList[i].is_collect == false) {
            that.data.d[i] = false
          } else {
            that.data.d[i] = true
          }
        }
        that.setData({
          items: searchList
        })
      } else {
        if (res.data.data.length != 0) {
          that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.items.concat(res.data.data)
          for (let i = 0; i < searchList.length; i++) {
            if (searchList[i].is_collect == false) {
              that.data.d[i] = false
            } else {
              that.data.d[i] = true
            }
          }
          that.setData({
            items: searchList,
          })
        }
      }
    })
  },
  // 获取滑动的高度
  scollsd: function (e) {
    var height = wx.getStorageSync('imgheight')
    var that = this
    this.setData({
      topsc: e.detail.scrollTop,
      top: this.data.imgheight - e.detail.scrollTop
    })
    if (e.detail.scrollTop >= (this.data.imgheight)) {
      that.setData({
        imgheight: 0
      })
    }
    if (parseInt(e.detail.scrollTop) < parseInt(height)) {
      that.setData({
        imgheight: wx.getStorageSync('imgheight')
      })
    }
  },
  // 跳转
  jumpx: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  // 选
  touch: function (e) {
    let word = e.currentTarget.dataset.cordw;
    let inx = e.currentTarget.dataset.index
    this.setData({
      keyword: word,
      wordinx: inx,
      page: 1,
      isFromSearch: false,
      item_State: false,
      tops: 0,
    })
    this.getajax();
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })
  },
  //改变心颜色
  change: function (e) {
    let that = this;
    let index = e.currentTarget.id;
    let goods_id = e.currentTarget.dataset.id;
    let word = this.data.keyword
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    if (this.data.d[index] == false) {
      gets.getdatas("/api/goods_collect/add", {
        "goods_id": goods_id
      }, function (res) {
        if (res.code == 0) {
          let tops = that.data.topsc;
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            duration:1000,
            mask:true,
            success: function () {
              that.setData({
                ["d[" + index + "]"]: true,
                page: 1,
                isFromSearch: false,
                item_State: false,
                tops: tops,
              })
              gets.getdatas("/api/goods/new_list", {
                "page": 1,
                "keyword": word,
                "pageSize":that.data.items.length
              }, function (res) {
                that.setData({
                  items:res.data.data
                })
              })
            }
          })
        }
      })
    } else {
      let tops = that.data.topsc;
      gets.getdatas("/api/goods_collect/del", {
        "goods_id": goods_id
      }, function (res) {
        if (res.code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '删除成功',
            duration:1000,
            mask:true,
            success: function () {
              that.setData({
                ["d[" + index + "]"]: false,
                page: 1,
                isFromSearch: false,
                searchLoading: true,
                searchLoadingComplete: false,
                item_State: false,
                tops: tops,
              })
              gets.getdatas("/api/goods/new_list", {
                "page": 1,
                "keyword": word,
                "pageSize":that.data.items.length
              }, function (res) {
                that.setData({
                  items:res.data.data
                })
              })
            }
          })
        }
      })
    }
  },
  onLoad: function (options) {
    let that = this
    wx.createSelectorQuery().select('.topimg').boundingClientRect(function (e) {
      wx.setStorageSync('imgheight', e.height)
      that.setData({
        imgheight: e.height
      })
    }).exec()
    wx.createSelectorQuery().select('.header').boundingClientRect(function (e) {
      that.setData({
        headheight: e.height
      })
    }).exec()
    if (options.keyword) {
      this.setData({
        keyword:options.keyword,

      })
    }

  },
  onShow: function () {
    let types = "1";
    if (types == "1") {
      this.getajax();
    } else {
      let keyword = options;
      if (keyword == undefined) {
        return
      } else {
        this.setData({
          keyword: keyword
        })
      }
      this.getajax();
    }
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {

  },
  onReachBottom: function () {
    let that = this;
    let keyword = that.data.keyword;
    let page = that.data.page
    if (that.data.total == that.data.items.length) {
      wx.showToast({
        title:"没有更多数据了",
        icon:"none",
        duration:1500
      })
      return false
    }
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    if (that.data.total != that.data.items.length) {
      that.setData({
        page: that.data.page + 1,
        isFromSearch: false,
      })
      that.getajax();
    }
  }
})