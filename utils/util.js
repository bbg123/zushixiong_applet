function getdatas(urls, data, callback) {
  var urlsss = "https://www.zushixiong.com";
  wx.request({
    url: urlsss + urls,
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "DeviceId": "xcx",
      "access-token": wx.getStorageSync('token'),
    },
    data: data,
    dataType: "json",
    fail: function (res) {},
    success: function (res) {
      callback(res.data)
    }
  });
}

// 检查是否有token,阻塞进程
function check(app ,callback) {
  var timer = setInterval(() => {
    if (app.globalData.code == 200) {
      clearInterval(timer)
      callback()
    }
  }, 500)
}

// 保存FormId
function saveFormId(e, type, cb) {
  let formId = e.detail.formId;
  if (!formId) return;

  if (formId == 'the formId is a mock one') {
    console.log('调试模式，获得真实有效的 formId 需要在真机上运行');
  } else {
    getdatas('/api/xcx/saveFormId', {
      id: formId,
      type: type
    }, function (res) {
      console.log(res);
      return typeof cb == "function" && cb(res)
    })
  }
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function px2rpx(px, windowWidth) {
  return Math.round(px * 750 / windowWidth);
}

function rpx2px(rpx, windowWidth) {
  return Math.round(rpx / 750 * windowWidth);
}

// 发送别人分享码
function get_share_code(friend_share_code) {
  getdatas('/api/user/setFriendShareCode', {friend_share_code: friend_share_code}, function() {})  
}

function get_res(p, app, callback = function(){}) {
  // 判断是否有邀请码
  if (p.shareCode) {
    let shareCode = wx.getStorageSync('ItshareCode')
    if (shareCode != p.shareCode) {
      wx.setStorageSync('ItshareCode', p.shareCode)
      this.check(app ,() => {
        this.get_share_code(p.shareCode)
        callback()
      })
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// end



module.exports = {
  getdatas: getdatas,
  check: check,
  formatTime: formatTime,
  px2rpx: px2rpx,
  rpx2px: rpx2px,
  saveFormId: saveFormId,
  get_share_code: get_share_code,
  get_res: get_res
}