
//获取应用实例
var api = require("../../utils/api.js");
const app = getApp()
// var applogin = require("../../library/applogin.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    tishi:true
  },

  hide_tishi: function () {
    this.setData({
      tishi: false
    })
  },

  to_tishi: function () {
    wx.switchTab({
      url: '/pages/me/me',
    })
  },
  onLoad: function () {
    
  },


  //输入字符串是获取用户输入的字符
  userMobileInput: function (e) {
    var that = this
    var phone = e.detail.value
    if (phone == '') {
      this.setData({
        phone_tip: '',
        account: e.detail.value

      })
      return
    } else if (phone.length != 11) {
      this.setData({
        phone_tip: '手机号错误',
        account: e.detail.value

      })
      return
    } else {
      this.setData({
        phone_tip: '',
        account: e.detail.value

      })
    }

  },



  userpass: function (e) {
    var that = this
    var password = e.detail.value
    if (password == '') {
      this.setData({
        password_tip: '',
        password: e.detail.value

      })
      return
    } else if (password.length < 6) {
      this.setData({
        password_tip: '密码错误',
        password: e.detail.value

      })
      return
    } else {
      this.setData({
        password_tip: '',
        password: e.detail.value

      })
    }
  },

  //跳转到验证码登录页面
  toValidatePage: function (e) {
    wx.redirectTo({
      url: '/pages/user/validate_login/validate_login',
    })
  },

  //跳转到忘记密码页面
  toForgetPasswordPage: function (e) {
    wx.redirectTo({
      url: '/pages/user/forget_password/forget_password',
    })
  },

  //用户登录表单提交
  formSubmit: function (e) {
    this.appUserLogin(e);
  },



  appUserLogin: function (e) 
{
    var that = this;
    var formData = e.detail.value;

    //手机号校验
    if(formData.account == '') {
      this.setData({
        phone_tip: '手机号不能为空',
      })
      return
}

if (formData.account.length != 11) {
  this.setData({
    phone_tip: '手机号错误',
  })
  return
}

//密码不能为空
if (formData.password == '') {
  this.setData({
    password_tip: '密码不能为空',
  })
  return
} else if (formData.password.length < 6){
  this.setData({
    password_tip: '密码错误',
  })
  return
}

wx.showLoading({
  title: '登录中，请稍候',
})
var submitData = {};
submitData.account = formData.account;
submitData.password = formData.password;
submitData.avatar = wx.getStorageSync('avatar');
submitData.open_id = wx.getStorageSync('openid');
submitData.union_id = wx.getStorageSync('unionid');
wx.request({
  url: api.login_user,
  data: submitData,
  header: {
    'Content-Type': 'application/json'
  },
  success: function (res) {
    if (res.data.code == 200) {
      wx.setStorageSync('user_id', res.data.data.user_id);

      wx.setStorageSync('real_name', res.data.data.real_name);
      wx.setStorageSync('telphone', res.data.data.telphone);
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      return wx.showModal({
        title: '错误提示',
        content: '登录失败，请重试！【' + res.data.message + '】',
        showCancel: false
      })
    }
  },
  complete: function (res) {
    setTimeout(function () {
      wx.hideLoading()
    }, 1000);
  }
})

return true;
}

})
