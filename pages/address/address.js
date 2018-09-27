
var util = require('../../utils/util.js');
var token = wx.getStorageSync("token")
var app = getApp()
var wxviewType = require('../../lib/wxview.js');
var time;


// 
var touchData = {
  init: function () {
    this.firstTouchX = 0;
    this.firstTouchY = 0;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    this.lastTouchTime = 0;
    this.swipeDirection = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.totalDelateX = 0;
    this.speedY = 0;
  },
  touchstart: function (e) {
    this.init();
    this.firstTouchX = this.lastTouchX = e.touches[0].clientX;
    this.firstTouchY = this.lastTouchY = e.touches[0].clientY;
    this.lastTouchTime = e.timeStamp;
  },
  touchmove: function (e) {
    this.deltaX = e.touches[0].clientX - this.lastTouchX;
    this.deltaY = e.touches[0].clientY - this.lastTouchY;
    this.totalDelateX += this.deltaX;
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
    this.lastTouchTime = e.timeStamp;
    if (this.swipeDirection === 0) {
      if (Math.abs(this.deltaX) > Math.abs(this.deltaY)) {
        this.swipeDirection = 1;
      }
      else {
        this.swipeDirection = 2;
      }
    }
  },
  touchend: function (e) {
    var deltaTime = e.timeStamp - this.lastTouchTime;
    this.speedY = this.deltaY / deltaTime;
  }
}
var timer;
// end

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    height: 0,
  },
  // 
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 185, //消息列表项最大左滑距离
  correctMoveLeft: 160, //显示菜单时的左滑距离
  thresholdMoveLeft: 75,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  render: function () {
    this.setData(this.renderData);
    this.renderData = {};
  },
  getRenderData: function () {
    return this.renderData;
  },
  ontouchstart: function (e) {
    let that = this;
     time = 1;
    timer = setInterval(function jiatime() {
      time++;
      if (time >= 8) {
        that.msgListView.ontouchstart(e);
        touchData.touchstart(e);
        if (that.showState === 1) {
          that.touchStartState = 1;
          that.showState = 0;
          that.moveX = 0;
          that.translateXMsgItem(that.lastShowMsgId, 0, 200);
          that.lastShowMsgId = "";
          return;
        }
        if (touchData.firstTouchX > that.swipeCheckX) {
          that.swipeCheckState = 1;
        }
      }
    }, 14)

  },
  ontouchmove: function (e) {
    touchData.touchmove(e);
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    //滑动container，只处理垂直方向
    if (e.currentTarget.id === 'id-container') {
      this.msgListView.ontouchmove(e, touchData.deltaY);
      return;
    }
    //已触发垂直滑动
    if (touchData.swipeDirection === 2) {
      this.msgListView.ontouchmove(e, touchData.deltaY);
      return;
    }
    var moveX = touchData.totalDelateX;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.target.id, moveX, 0);
  },

  // 删除地址
  dele: function (e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除？',
      success: function (res) {
        if (that.showState === 1) {
          that.touchStartState = 0;
          that.showState = 0;
          that.moveX = 0;
          that.translateXMsgItem(that.lastShowMsgId, 0, 200);
          that.lastShowMsgId = "";
        }
        if (res.confirm) {
          util.getdatas("/api/address/del", { "address_id": id }, function (res) {
            if (res.code == 0) {
              if (that.showState === 1) {
                that.touchStartState = 1;
                that.showState = 0;
                that.moveX = 0;
                that.translateXMsgItem(that.lastShowMsgId, 0, 200);
                that.lastShowMsgId = "";
              }
              that.getdata();
            } else {
              let msg = res.msg;
              wx.showModal({
                title: msg,
                content: '',
              })
            }
          })
        }
      }
    })

  },
  ontouchend: function (e) {
    let that = this;
    if (time <= 8) {
      clearInterval(timer)
      let types = that.data.types;
      let index = e.currentTarget.dataset.index;
      if (types == 1) {
        wx.setStorageSync("index", index)
        wx.navigateBack({
          delta: 1,
        })
      }
    }else{
      clearInterval(timer);
      touchData.touchend(e);
      this.swipeCheckState = 0;
      if (this.touchStartState === 1) {
        this.touchStartState = 0;
        return;
      }
    }
    //滑动container，只处理垂直方向
    if (e.currentTarget.id === 'id-container') {
      this.msgListView.ontouchend(e, touchData.speedY);
      return;
    }
    //垂直滚动
    if (touchData.swipeDirection === 2) {
      this.msgListView.ontouchend(e, touchData.speedY);
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      return;
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
    }
    this.translateXMsgItem(e.currentTarget.id, this.moveX, 200);
  },
  getItemIndex: function (id) {
    var msgList = this.data.msgList;
    for (var i = 0; i < msgList.length; i++) {
      if (msgList[i].id === id) {
        return i;
      }
    }
    return -1;
  },
  translateXMsgItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'msgList[' + index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  // end
  adds: function () {
    wx.navigateTo({
      url: '../add_adress/add_adress?id=1',
    })
  },
  change: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    if (that.showState === 1) {
      that.touchStartState = 0;
      that.showState = 0;
      that.moveX = 0;
      that.translateXMsgItem(that.lastShowMsgId, 0, 200);
      that.lastShowMsgId = "";
    }
    wx.navigateTo({
      url: '../add_adress/add_adress?type=1&id=' + id + '&index=' + index + '&types=3',
    })
  },
  jump: function (e) {
    let types = this.data.types;
    let index = e.currentTarget.dataset.index;
    if (types == 1) {
      wx.setStorageSync("index", index)
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  getdata: function () {
    let that = this;
    util.getdatas("/api/address/get", {}, function (res) {
      that.setData({
        address: res.data,
      })
    })
  },
  onLoad: function (options) {
    let that = this
    this.setData({
      types: options.type
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    this.getdata();
    this.renderData = {};

    this.msgListView = wxviewType.createWXView();
    this.msgListView.setAnimationParam('msgListAnimation');
    this.msgListView.page = this;

    var windowWidth = app.data.deviceInfo.windowWidth;
    var windowHeight = app.data.deviceInfo.windowHeight;
    var height = 0;
    for (var i = 0; i < 20; i++) {
      var msg = {};
      msg.id = 'id-' + i + 1;
      this.data.msgList.push(msg);
      height += util.rpx2px(150, windowWidth);
    }
    this.msgListView.setWH(windowWidth, windowHeight);
    this.msgListView.setBound(Math.min(0, windowHeight - height), 0);
    this.setData({ msgList: this.data.msgList });
    // end
  },
  onShow: function (e) {
    this.getdata();
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {

  }
})