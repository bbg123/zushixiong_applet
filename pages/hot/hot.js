var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({
  data: {
    keyword: "全部",
    page: 1,
    isFromSearch: true,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    item_State: true,
  },
  // 广告位
  geta: function () {
    let that = this;
    gets.getdatas("/api/ad/info", { "id": 3 }, function (res) {
      that.setData({
        img_list: res.data
      })
    })
  },
  getajax: function () {
    let that = this;
    let word = this.data.keyword;
    let searchList = [];
    let page = that.data.page;
    let item_State = that.data.item_State;
    gets.getdatas("/api/goods/hot_list", { "page": page, "keyword": word }, function (res) {
      wx.hideLoading()
      that.setData({
        total:res.data.total
      })
      if (item_State == false) {
        searchList = res.data.data;
        that.setData({
          items: searchList,
        })
      } else {
        if (res.data.data != 0) {
          that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.items.concat(res.data.data)
          that.setData({
            items: searchList,
          })
        } else {
          that.setData({
            searchLoadingComplete: true,
            searchLoading: false,
          })
        }
      }
    })
  },  // 获取滑动的高度
  scollsd:function(e){
      var height = wx.getStorageSync('imghei')
      var that = this
      this.setData({
        topsc:e.detail.scrollTop,
        top:this.data.imgheight - e.detail.scrollTop
      })
      if (e.detail.scrollTop >= (this.data.imgheight)) {
        that.setData({
          imgheight:0
        })
      }
      if (parseInt(e.detail.scrollTop) < parseInt(height)) {
        that.setData({
          imgheight:wx.getStorageSync('imghei')
        })
      }
  },
  bottomscroll: function() {
    let that = this;
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    if (that.data.items.length != that.data.total) {
      that.setData({
        page: that.data.page + 1,
        isFromSearch: false,
        item_State: true,
      })
      that.getajax();
    } else {
      wx.showToast({
        title:"没有更多数据",
        icon:"none",
        duration:1000
      })
    }
  },
  // 跳转
  jump: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  // 选
  touch: function (e) {
    let word = e.currentTarget.dataset.cordw;
    this.setData({
      keyword: word,
      page: 1,
      isFromSearch: false,
      searchLoading: true,
      searchLoadingComplete: false,
      item_State: false,
      tops:0,
    })
    this.getajax();
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })  
  },
  jumps: function (e) {
    let id = e.currentTarget.dataset.params;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  jumpss:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id,
    })
  },
  onLoad: function (options) {
    let that = this
    let types = options.typs;
    // let types = "1";
    if (types == "1") {
      this.getajax();
      this.geta();
    } else {
      let keyword = options.keyword;
      this.setData({
        keyword: keyword,
      })
      this.getajax();
      this.geta();
    }
    wx.createSelectorQuery().select('.header').boundingClientRect(function(e){
      wx.setStorageSync('imghei',e.height) 
      that.setData({
        imgheight:e.height
      })
    }).exec()
    wx.createSelectorQuery().select('.choss').boundingClientRect(function(e){
      that.setData({
        headheight:e.height + 10
      })
    }).exec()

  },
  onShow: function () {
    token = wx.getStorageSync("token");
  }
})
