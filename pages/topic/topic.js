var gets = require('../../utils/util.js');
var token = wx.getStorageSync("token")
Page({

  data: {
    id:1,
    d: [],
  },
  getajax:function(){
    let id = parseInt(this.data.id);
    let that = this;
    gets.getdatas("/api/topic/info",{"id":id},function(res){
      // 抽取图片地址
      let a = res.data.content;
      let b = /<img[^>]+src=['"]([^'"]+)['"]+/g;
      var s = a.match(b);
      var result = [], temp;
      while ((temp = b.exec(a)) != null) {
        result.push(temp[1]);
      }
      var zz = [];
      var dd=[];
      var arr = "https://www.zushixiong.com"
      for (let a = 0; a < result.length; a++) {
        if (result[a].substr(0, 7).toLowerCase() == "http://"){
          zz.push(result[a])
        }else{
          zz.push(arr + result[a])
        }
        dd.push(result[a])
      }
      // end
      that.setData({
        top_img:zz,
        items:res.data.goods_list,
        all:res.data
      })
    })
  },
  //改变心颜色
  change: function (e) {
    let that = this;
    let goods_id = parseInt(e.currentTarget.dataset.id);
    let iscollect = e.currentTarget.dataset.iscollect
    if (!iscollect) {
      gets.getdatas("/api/goods_collect/add", { "goods_id": goods_id }, function (res) {
        if (res.code == 0) {
          wx.showToast({
          title: '添加成功',
          duration: 1500
          })
        }
        that.setData({
          page: 1,
          isFromSearch: false,
          searchLoading: true,
          searchLoadingComplete: false,
          item_State: true,
          tops: 0,
        })
        that.getajax();
      })
    } else {
      gets.getdatas("/api/goods_collect/del", { "goods_id": goods_id }, function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '删除成功',
            duration: 1500
          })
          that.setData({
            page: 1,
            isFromSearch: false,
            searchLoading: true,
            searchLoadingComplete: false,
            item_State: true,
            tops: 0,
          })
          that.getajax();
        }
      })
    }
    
  },
  // 跳转到商品详情
  jumpx:function(e){
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: '../choimmer/choimmer?id='+id,
      })
  },
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      id:id,
    })
    this.getajax();
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
      mask: true,
    })  
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {
    
  }
})