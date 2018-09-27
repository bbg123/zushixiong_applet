//app.js
var mta = require('./utils/mta_analysis.js');
var login_url = 'https://www.zushixiong.com/api/xcx'; //登录  第一版
// var login_url = 'https://api.zushixiong.com/api/xcx/' // 登录  第二版
App({
  data: {
    deviceInfo: {}
  },
  mta: mta,
  // 更新小程序
  updatezsx: function () {
    // 判断版本号
    wx.getSystemInfo({
      success: function (res) {
        var version = res.SDKVersion;
        if (version >= '1.9.90') {
          const updateManager = wx.getUpdateManager()

          updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
          })

          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })

          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败',
              showCancel: false
            })
          })
        }
      }
    })
  },

  // 获取token  第一版
  getToken: function (callback = function(){}) {
    // 登录验证
    wx.login({
      success: (res) =>　{
        wx.setStorageSync('code', res.code)
        wx.request({
          url: login_url + '/jscode2session',
          data: {
            'code': res.code
          },
          method: 'POST',
          dataType: 'json',
          success: (res)　=> {
            wx.setStorageSync('token', res.data.data.session3rd)
            wx.setStorageSync("share_code", res.data.data.share_code)
            wx.setStorageSync('ItshareCode', res.data.data.friend_share_code)
            callback(res)
            this.globalData.code = 200
          }
        })
      }
    })
  },
  // 获取token 第二版
  // getToken: function (callback = function(){}) {
  //   // 登录验证
  //   wx.login({
  //     success: (res) =>　{
  //       wx.request({
  //         url: login_url + 'getSession',
  //         data: {
  //           'code': res.code
  //         },
  //         method: 'POST',
  //         dataType: 'json',
  //         success: (res)　=> {
  //           wx.setStorageSync('token', res.data.session3rd)
  //           callback(res)
  //           this.globalData.code = 200
  //         }
  //       })
  //     }
  //   })
  // },

  // 登录
  login: function (callback = function(){}) {
    let token = wx.getStorageSync('token') || ''
    if (token == '') {
      this.getToken()
    } else {
      // 返回token是否有效
      this.checkToken(token, (res) => {
        if (res.data.code == 1) {
          this.getToken()
        } else {
          this.globalData.code = 200
          callback(res)
        }
      })
    }
  },

  // 检查token  第一版
  checkToken: function (token, callback) {
    wx.request({
      url: login_url + '/check3rdSession',
      data: {
        'session3rd': token
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        callback(res)
      }
    })
  },
  // 检查token 第二版
  // checkToken: function (token, callback) {
  //   wx.request({
  //     url: login_url + 'checkSession',
  //     data: {
  //       'session3rd': token
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     success: function (res) {
  //       callback(res)
  //     }
  //   })
  // },
  // end
  onLaunch: function () {
    this.login()
    this.data.deviceInfo = wx.getSystemInfoSync()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.updatezsx()
    mta.App.init({
      "appID": "500620746",
    })
  },

  globalData: {
    userInfo: null,
    code: 201
  },
})