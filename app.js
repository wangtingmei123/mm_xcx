var api = require("utils/api.js");
//app.js
var applogin = require("./library/applogin.js");

App({
  onLaunch: function () {
    var that = this;
  
    //微信第三方登录
    that.appWechatLogin();




//强制更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        // 新版本下载成功
        updateManager.onUpdateReady(function () {

          wx.showModal({
            title: '更新提示',
            showCancel: false,
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              updateManager.applyUpdate()

            }
          })
        })
      }

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        showCancel:false,
        content: '新版本已经上线啦~，请您删除当前小程序，重新打开哟~'
      })
    })






    wx.setEnableDebug({
      enableDebug: false
    })

  },


  //检查微信登录状态
  appWechatCheckLogin : function() {
    var that = this;
    wx.checkSession({
      success: function () {
        if (wx.getStorageSync(session_key) == ''){
          that.appWechatLogin();//检查session_key未过期，但是没获取到session_key，需要重新获取session_key
        }  
       },
      fail: function () {
        that.appWechatLogin();//执行登录过程，重新获取session_key
      }
    })
  },

  //执行微信的登录操作、换取session_key
  appWechatLogin: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          console.log("-________-")
          console.log(res)
          wx.request({
            url: api.login,
            data: {
              code: res.code
            },
            success: function (login_res) {
              if (login_res.data.code == 200) {
                wx.setStorageSync('login_time', Date.parse(new Date()) / 1000);
                wx.setStorageSync('session_key', login_res.data.data.session_key);
                wx.setStorageSync('openid', login_res.data.data.openid);
                wx.setStorageSync('unionid', login_res.data.data.unionid);

                if (that.wechatLoginCallback) {
                  //console.log('异步回调失败！');
                  that.wechatLoginCallback(that); //首页获取步数回调
                }

              } else {
                return wx.showModal({
                  title: '错误提示',
                  content: '微信授权登录失败【' + login_res.data.message + '】',
                  showCancel: false,
                  confirmText: '重试',
                  success: function () {
                    that.appWechatLogin();//微信登录获取session_key，重试获取登录一遍获取session_key
                  }
                })
              }
            },
            complete: function (res) { }
          })
        } else {
          wx.showToast({
            title: '微信授权登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });  
  },




  globalData: {
    userInfo: null
  },
  appVersion: 'v1.0.10',
  userSystemInfo: '',
  appHttpsDomain: 'https://www.xindongguoji.com/',
})