
var timer;
Page({


  data: {
    touch: false,
    send: "获取验证码",
    sends: false,
  },
  checkbox: function () {
    let touch = !this.data.touch;
    this.setData({
      touch: touch,
    })
  },
  phone: function (e) {
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  ma: function (e) {
    let ma = e.detail.value;
    this.setData({
      ma: ma,
    })
  },
  yi: function () {
    wx.navigateTo({
      url: '../365/365',
    })
  },
  send: function () {
    let that = this;
    let sends = !this.data.sends;
    let phone = this.data.phone;
    let time = 60;
    wx.request({
      url: "https://www.zushixiong.com/api/sms/send",
      data: { "mobile": phone },
      header: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      dataType: "json",
      success: function (res) {
        if (res.data.code == 0) {
          timer = setInterval(fun1, 1000);
          that.setData({
            sends: sends,
          })
        } else {
          let msg = res.data.msg;
          clearInterval(timer)
          wx.showModal({
            title: '',
            content: msg,
          })
        }
      },
    })
    function fun1() {
      time--;
      if (time >= 0) {
        let times = time + "秒后重新获取";
        that.setData({
          send: times,
        })
      } else {
        let times = "重新发送验证码";
        let sends_s = !that.data.sends;
        clearInterval(timer)
        that.setData({
          send: times,
          sends: sends_s,
        })
      }
    }
  },
  active: function () {
    let that = this;
    let touch = !this.data.touch;
    let phone = this.data.phone;
    let ma = this.data.ma;
    let openid = wx.getStorageSync("openid");
    let name = wx.getStorageSync("name");
    let img = wx.getStorageSync("img");
    if (name == "") {
      wx.showModal({
        title: '',
        content: '你必须点击确认后授权才能够登录',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function (res) {
                if (res.authSetting["scope.userInfo"] == true) {
                  wx.getUserInfo({
                    success: function (res) {
                      name = res.userInfo.nickName;
                      img = res.userInfo.avatarUrl;
                      wx.setStorageSync("name", name);
                      wx.setStorageSync("img", img);
                    }
                  })

                }
              } 
            })
          }
        }
      })
    } else {
      wx.request({
        url: "https://www.zushixiong.com/api/user/login",
        data: { "mobile": phone, "code": ma, "type": "xcx", "openid": openid, "nickname": name, "avatar": img },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        dataType: "json",
        success: function (res) {
          if (res.data.code == 0) {
            let token = res.data.data.token;
            clearInterval(timer)
            wx.setStorageSync("token", token);
            that.setData({
              touch: touch,
            })
            let ty = wx.getStorageSync("ty")
            if (ty == 1) {
              wx.redirectTo({
                url: "../Home/home"
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          } else {
            let msg = res.data.msg;
            wx.showModal({
              title: '',
              content: msg,
            })
          }
        }
      })
    }


  },
  onLoad: function (options) {
    let openid = wx.getStorageSync("openid")
    if (!openid) {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            let code = res.code
            wx.request({
              url: 'https://www.zushixiong.com/api/xcx/jscode2session',
              data: {
                "code": code,
              },
              success: function (res) {
                let openid = res.data.data.openid;
                wx.setStorageSync("openid", openid)
                wx.setStorageSync("ty", 1)
                wx.redirectTo({
                  url: "../login/login"
                })
              }
            })
          }
        }
      });
    }
  },
})