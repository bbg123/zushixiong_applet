var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  data: {
    keyword:"全部",
    id:"",
    page: 1,
    isFromSearch: true,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    item_State: true,
    collect_t:false, 
    chang: false,
    topc: false,
    d:[],
    scolltop:"",
    pagesize:20
  },
  getajax: function () {
    let id = this.data.id;
    let that = this;
    gets.getdatas("/api/brand/info",{"id":id},function(res){
      if (res.data.is_collect==true){
        that.setData({
          top: res.data,
          collect_t: true, 
          is_collect: res.data.is_collect,
          fans_count: res.data.fans_count
        })
      }else{
        that.setData({
          top: res.data,
          collect: "1",
          collect_t: false,
          is_collect: res.data.is_collect,
          fans_count: res.data.fans_count
        })
      }
      setTimeout(function () {
        wx.createSelectorQuery().selectAll('.small_txt').boundingClientRect(function (rect) { 
          let arr = []
          rect.forEach(function(item) {
            arr.push(item.width)
          })
          that.setData({
            textsWidth: arr
          })
        }).exec()
      }, 300)
    })
  },
  // 
  back:function(){
    this.setData({
      scolltop:0,
    })
  },
  // 
  jumpx:function(e){
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id='+id,
    })
  },
  scroll: function (e) {
    let that = this;
    let topsz = e.detail.scrollTop
    this.setData({
      topsz: topsz
    })
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
  // 
  up:function(){
    let chang = !this.data.chang
    this.setData({
      chang:chang,
    })
  },
  // 
  touch: function (e) {
    let word = e.currentTarget.dataset.cordw;
    this.setData({
      keyword: word,
      page: 1,
      isFromSearch: false,
      searchLoading: true,
      searchLoadingComplete: false,
      item_State: false,
    })
    this.gets();
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })  
  },
  // 点赞
  zan:function(){
    let that = this;
    let collect_t = this.data.collect_t;
    let id = this.data.id;
    let is_collect = this.data.is_collect
    let fans_count = this.data.fans_count;
    if (collect_t==true){
      gets.getdatas("/api/brand/add_collect", { "id": id, "collect": 0},function(res){
        if(res.code==0){
            that.setData({
              is_collect:false,
              collect_t:false,
              fans_count: fans_count-1
            })
        }else{
          let msg = res.msg;
          wx.showModal({
            title: '',
            content: msg,
          })
        }
      })
    }else{
      gets.getdatas("/api/brand/add_collect", { "id": id, "collect": 1 }, function (res) {
        if (res.code == 0) {
          that.setData({
            is_collect: true,
            collect_t: true,
            fans_count: fans_count+1
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
  //改变心颜色
  change: function (e) {
    let that = this;
    let index = e.currentTarget.id;
    let goods_id = e.currentTarget.dataset.id;
    let topc = this.data.topsz;
    let id = this.data.id;
    let word = this.data.keyword;
    if (this.data.d[index] == false) {
      gets.getdatas("/api/goods_collect/add", { "goods_id": goods_id }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '添加成功',
            duration: 1000
          })
          that.setData({
            ["d[" + index + "]"]: true,
            page: 1,
            isFromSearch: false,
            searchLoading: true,
            searchLoadingComplete: false,
            item_State: true,
            tops: 0,
          })
          gets.getdatas("/api/goods/get", { "brand": id,"keyword":word ,"page":1,"pageSize":that.data.items.length}, function (res) {
            that.setData({
              items: res.data.data
            })
          })
        }
      })
    } else {
      gets.getdatas("/api/goods_collect/del", { "goods_id": goods_id }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '删除成功',
            duration: 1000
          })
          that.setData({
            ["d[" + index + "]"]: false,
            page: 1,
            isFromSearch: false,
            searchLoading: true,
            searchLoadingComplete: false,
            item_State: true,
            tops: 0,
          })
          gets.getdatas("/api/goods/get", { "brand": id,"keyword":word ,"page":1,"pageSize":that.data.items.length}, function (res) {
            that.setData({
              items: res.data.data
            })
          })
        }
      })
    }
  },
  // 获取商品列表
  gets:function(){
    let that = this;
    let id = this.data.id;
    let word = this.data.keyword;
    let page = this.data.page;
    let searchList = [];
    let item_State = that.data.item_State;
    gets.getdatas("/api/goods/get", { "brand": id,"keyword":word ,"page":page}, function (res) {
      wx.hideLoading()
      that.setData({
        total:res.data.total
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
          items: searchList,
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
        } else {
          that.setData({
            searchLoadingComplete: true,
            searchLoading: false,
          })
        }
      }
    })
  },
  // 滑动到底部
  bottomscroll: function () {
    let that = this;
    if (that.data.total == that.data.items.length) {
      wx.showToast({
        title:"没有更多数据了",
        mask:true,
        icon:'none',
        duration:1500
      })
      return false
    }
    if (that.data.total != that.data.items.length) {
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      that.setData({
        page: that.data.page + 1,
        isFromSearch: false,
        item_State: true,
      })
      that.gets();
    }
      
  },
  onLoad: function (options) {
    let id = options.id
    this.setData({
      id:id,
    })
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        })
      }
    })
    this.getajax();
    this.gets();
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})