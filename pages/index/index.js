  132121  
//获取应用实例
const app = getApp()
var token = wx.getStorageSync("token")
var gets = require('../../utils/util.js');
let items
let topsz
var t
Page({
  data: {
    tang: false,
    items: [],
    keyworder: '',
    crowd: '',
    brand: '',
    page: 1,
    price: "asc",
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
    topc: false,
    d: [], //开关
    turn: true,
    item_State: "",
    topbtn: false,
    checc: "", //人群选中条件
    peoples_true: false,
    scolltop: "",
    xuans: true,
    arrc: [],
    ds: {},
    rent_price_min: "",
    rent_price_max: "",
    styleTxt: '',
    movementTxt: '',
    is_new: 0,
    is_hot: 0,
    chestyle: '',
    chemovement: '',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.redirectTo({
      url: '../Home/home'
    })
  },
  // 价格筛选
  oo: function (e) {
    let turn = this.data.turn
    if (turn == true) {
      this.setData({
        price: "desc",
        turn: false,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: 0,
        is_new: 0
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    } else {
      this.setData({
        price: "asc",
        turn: true,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: 0,
        is_new: 0
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    }
  },
  newslist: function () {
    let that = this;
    let is_new = this.data.is_new ? 0 : 1
    if (is_new == 1) {
      this.setData({
        price: "asc",
        turn: true,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: 0,
        is_new: is_new
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    } else {
      this.setData({
        price: "asc",
        turn: true,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: 0,
        is_new: is_new
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    }
  },
  popularity: function () {
    let that = this;
    let is_hot = this.data.is_hot ? 0 : 1
    if (is_hot == 1) {
      this.setData({
        price: "asc",
        turn: true,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: is_hot,
        is_new: 0
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    } else {
      this.setData({
        price: "asc",
        turn: true,
        searchLoadingComplete: false,
        searchLoading: false,
        item_State: false,
        page: 1,
        scolltop: 0,
        is_hot: is_hot,
        is_new: 0
      })
      wx.showLoading({
        title:"正在加载",
        mask:true
      })
      this.dd()
    }
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
  },
  goM: function () {
    wx.redirectTo({
      url: '../me/me'
    })
  },
  goL: function () {
    wx.redirectTo({
      url: '../collect/collect',
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  // 获取数据
  dd: function () {
    let that = this;
    let keyworder = that.data.keyworder;
    let crowd = that.data.crowd;
    let brand = that.data.brand;
    let price = that.data.price;
    let item_State = that.data.item_State;
    let page = that.data.page;
    let rent_price_max = that.data.rent_price_max;
    let rent_price_min = that.data.rent_price_min;
    let is_hot = that.data.is_hot;
    let is_new = that.data.is_new;
    var z;
    var d;
    let searchList = [];
    gets.getdatas("/api/goods/get", {
      "page": page,
      "crowd": crowd,
      "rent_price_order": price,
      "brand": brand,
      "keyword": keyworder,
      "rent_price_min": rent_price_min,
      "rent_price_max": rent_price_max,
      "is_hot": is_hot,
      "is_new": is_new
    }, function (res) {
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
          total:res.data.total
        })
      } else {
        if (res.data.data.length !== 0) {
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
            total:res.data.total
          })
        }
        if (that.data.items.length == res.data.total) {
          that.setData({
            searchLoadingComplete: true,
            searchLoading: false,
          })
        }
      }
      wx.hideLoading()
    })
  },
  //点击确定
  sure: function () {
    let xuans = !this.data.xuans;
    let arrs = this.data.ds;
    let newarr = [];
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    for (let a = 0; a < arrs.length; a++) {
      if (arrs[a] != false) {
        newarr.push(arrs[a]);
      }
    }
    let str = newarr.join(",");
    this.setData({
      keyworder: str,
      xuans: xuans,
      item_State: false,
      page: 1,
      peoples_true: false,
      searchLoadingComplete: false,
      searchLoading: false,
      scolltop: 0,
      crowd: ''
    })
    this.dd()
  },
  // 重置
  resent: function () {
    let arrs = this.data.ds;
    let newarr = [];
    for (let a = 0; a < arrs.length; a++) {
      newarr.push(false);
    }
    this.setData({
      ds: newarr,
      rent_price_min: "",
      rent_price_max: "",
    })
  },
  // 单选
  radio: function (e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;;
    let afr = "ds[" + id + "]";
    this.setData({
      [afr]: name
    })
  },
  // 获取配置接口
  getsajax: function () {
    let that = this;
    gets.getdatas("/api/goods/init", {}, function (res) {
      let people = res.data.crowd.data;
      let attribute = res.data.search.attribute
      for (let c = 0; c < res.data.search.attribute.length; c++) {
        if (!that.data.ds[c]) {
          that.setData({
            ["ds[" + c + "]"]: false
          })
        }
      }
      for (let i = 0; i < attribute.length; i++) {
        if (attribute[i].name === "风格") {
          that.setData({
            style: attribute[i].data
          })
        } else if (attribute[i].name === "机芯") {
          that.setData({
            movement: attribute[i].data
          })
        }
      }
      that.setData({
        peopel: people,
        attribute: res.data.search.attribute,
      })
    })
  },
  // 点击人群其中一个变为选中状态
  checc: function (e) {
    let checc = e.target.dataset.index;
    this.setData({
      checc: checc,
    })
  },
  chestyle: function (e) {
    let chestyle = e.target.dataset.index;
    this.setData({
      chestyle: chestyle
    })
  },
  chemovement: function (e) {
    let chemovement = e.target.dataset.index;
    this.setData({
      chemovement: chemovement
    })
  },
  // 点击清除
  clear: function () {
    this.setData({
      checc: "",
    })
  },
  styleclear: function () {
    this.setData({
      chestyle: "",
      keyworder: ''
    })
  },
  movementClear: function () {
    this.setData({
      chemovement: "",
      keyworder: ''
    })
  },
  //改变心颜色
  change: function(e) {
    let that = this;
    let keyworder = that.data.keyworder;
    let crowd = that.data.crowd;
    let brand = that.data.brand;
    let price = that.data.price;
    let rent_price_max = that.data.rent_price_max;
    let rent_price_min = that.data.rent_price_min;
    let is_hot = that.data.is_hot;
    let is_new = that.data.is_new;
    if (token){
      let index = e.currentTarget.id;
      let goods_id = e.currentTarget.dataset.id;
      if (e.currentTarget.dataset.iscollect == false) {
        gets.getdatas("/api/goods_collect/add", {
          "goods_id": goods_id
        }, function (res) {
          if (res.code == 0) {
            wx.showToast({
              title: '添加成功',
              duration: 1000,
              success: function () {
                that.setData({
                  searchLoadingComplete: false,
                  searchLoading: false,
                  item_State: false,
                })
                gets.getdatas("/api/goods/get", {
                  "page": 1,
                  "crowd": crowd,
                  "rent_price_order": price,
                  "brand": brand,
                  "keyword": keyworder,
                  "rent_price_min": rent_price_min,
                  "rent_price_max": rent_price_max,
                  "is_hot": is_hot,
                  "is_new": is_new,
                  "pageSize": that.data.items.length
                }, function (res) {
                  that.setData({
                    items:res.data.data
                  })
                  if (that.data.items.length == res.data.total) {
                    that.setData({
                      searchLoadingComplete: true,
                      searchLoading: false,
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        gets.getdatas("/api/goods_collect/del", {
          "goods_id": goods_id
        }, function (res) {
          if (res.code == 0) {
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              success: function () {
                that.setData({
                  searchLoadingComplete: false,
                  searchLoading: false,
                  item_State: false,
                })
                gets.getdatas("/api/goods/get", {
                  "page": 1,
                  "crowd": crowd,
                  "rent_price_order": price,
                  "brand": brand,
                  "keyword": keyworder,
                  "rent_price_min": rent_price_min,
                  "rent_price_max": rent_price_max,
                  "is_hot": is_hot,
                  "is_new": is_new,
                  "pageSize": that.data.items.length
                }, function (res) {
                  that.setData({
                    items:res.data.data
                  })
                  if (that.data.items.length == res.data.total) {
                    that.setData({
                      searchLoadingComplete: true,
                      searchLoading: false,
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
    
  },
  //点击确认
  again: function () {
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    let crawd = this.data.checc;
    this.setData({
      crowd: crawd,
      item_State: false,
      page: 1,
      peoples_true: false,
      searchLoadingComplete: false,
      searchLoading: false,
      scolltop: 0,
      topbtn: false,
      screenTxt: ''
    })
    this.dd()
  },
  onLoad: function () {
    this.setData({
      item_State: false,
    })
    this.dd();
    this.getsajax();
    this.getbrand();
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })
  },
  onShow: function () {
    let that = this;
    token = wx.getStorageSync("token")
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          bi_width: res.windowWidth,
        })
      }
    })
  },
  // 人群
  people: function (e) {
    this.setData({
      peoples_true: true,
      topbtn: true
    })
    switch (e.target.dataset.txt) {
      case "人群":
        this.setData({
          screenTxt: e.target.dataset.txt
        })
        break;
      case "风格":
        this.setData({
          screenTxt: e.target.dataset.txt
        })
        break;
      default:
        this.setData({
          screenTxt: e.target.dataset.txt
        })
        break;
    }
  },
  // 品牌
  brand: function () {
    let tang = !this.data.tang;
    this.setData({
      tang: tang,
      topbtn: true
    })
  },
  // 筛选
  sai: function () {
    let sai = !this.data.xuans;
    this.setData({
      xuans: sai,
    })
  },
  // 点击×去掉人群弹出窗
  chu: function () {
    this.setData({
      peoples_true: false,
      topbtn: false,
      screenTxt: ''
    })
  },
  styleAgain: function () {
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    let crawd = this.data.chestyle;
    let chemovement = this.data.chemovement
    if (chemovement != '') {
      chemovement += ','
    }
    this.setData({
      crowd: this.data.crowd,
      keyworder: chemovement + crawd,
      item_State: false,
      page: 1,
      peoples_true: false,
      searchLoadingComplete: false,
      searchLoading: false,
      scolltop: 0,
      topbtn: false,
      screenTxt: '',
      styleTxt: crawd
    })
    this.dd()
  },
  movementAgain: function () {
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    let crawd = this.data.chemovement
    let chestyle = this.data.chestyle
    if (chestyle != '') {
      chestyle += ','
    }
    this.setData({
      crowd: this.data.crowd,
      keyworder: chestyle + crawd,
      item_State: false,
      page: 1,
      peoples_true: false,
      searchLoadingComplete: false,
      searchLoading: false,
      scolltop: 0,
      topbtn: false,
      screenTxt: '',
      movementTxt: crawd
    })
    this.dd()
  },
  chosse: function () {
    let sai = !this.data.xuans;
    this.setData({
      xuans: sai,
    })
  },
  // 点击回到顶部
  back: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 品牌列表
  getbrand: function () {
    let that = this;
    gets.getdatas("/api/brand/get", {}, function (res) {
      let arr = [];
      let drr = []; //开关
      for (let a = 0; a < res.data.length; a++) {
        for (let b = 0; b < res.data[a].list.length; b++) {
          drr.push(true)
          if (res.data[a].list[b].is_collect == true) {
            arr.push(res.data[a].list[b].id)
          }
        }
      }
      that.setData({
        top_list: res.data,
        arr: arr,
        drr: drr,
      })
    })
  },
  // 关掉弹出窗
  canr: function () {
    let tang = !this.data.tang
    this.setData({
      tang: tang,
      topbtn: false
    })
  },
  gethader: function () {
    let that = this;
    gets.getdatas(url, {}, function (res) {
      let all_width = (res.data.length + 1) * 160;
      that.setData({
        headitems: res.data,
        all_width: all_width
      })
    })
  },
  di: function (e) {
    this.setData({
      rent_price_min: e.detail.value
    })
  },
  gao: function (e) {
    this.setData({
      rent_price_max: e.detail.value
    })
  },
  // 清除品牌
  clears: function () {
    this.setData({
      check: false,
      arr: [],
    })
  },
  // 多选
  choss: function (e) {
    let arr = this.data.arr;
    let ids = e.currentTarget.dataset.id;
    let id = e.detail.value;
    this.setData({
      arr: e.detail.value
    })
  },
  // 
  xian: function () {
    let tang = !this.data.tang;
    this.setData({
      tang: tang,
    })
    this.getbrand();
  },
  // 确认
  luo: function () {
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    let arr = this.data.arr;
    let str = arr.join();
    let that = this;
    this.setData({
      brand: str,
      tang: false,
      page: 1,
      peoples_true: false,
      searchLoadingComplete: false,
      searchLoading: false,
      item_State: false,
      scolltop: 0,
      topbtn: false
    })
    this.dd()
  },
  jumpx: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../choimmer/choimmer?id=' + id
    })
  },
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title:"正在加载",
      mask:true
    })
    if (this.data.items.length == this.data.total) {
      wx.showToast({
        title:"没有更多数据了",
        icon:"none",
        duration:1500
      })
      return false
    }
    if (that.data.total != that.data.items.length) {
      that.setData({
        page: that.data.page + 1,
        isFromSearch: false,
        item_State: true,
      })
      that.dd();
    }

  }
})