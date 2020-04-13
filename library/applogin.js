
var api = require("../utils/api.js");
//检查微信登录状态
// function appWechatLogin()
// {
//   wx.checkSession({
//     success: function () {
//       //session 未过期，并且在本生命周期一直有效
//     },
//     fail: function () {
//       //登录态过期
//       //wx.login() //重新登录

//       // 登录
//       wx.login({
//         success: res => {
//           if (res.code) {
//             wx.request({
//               url: getApp().appHttpsDomain + 'wechatrun/index/login',
//               data: {
//                 code: res.code
//               },
//               success: function (login_res) {
//                 console.log('wechatrun/index/login结果', login_res)
//                 if (login_res.data.code == 200) {
//                   wx.setStorageSync('login_time', Date.parse(new Date()) / 1000);
//                   wx.setStorageSync('session_key', login_res.data.data.session_key);
//                   wx.setStorageSync('openid', login_res.data.data.openid);
//                   wx.setStorageSync('unionid', login_res.data.data.unionid);

//                   if (app.wechatLoginCallback) {
//                     util.getWechatRunData(that); //首页获取步数回调
//                   }

//                 } else {
//                   return wx.showModal({
//                     title: '错误提示',
//                     content: '微信授权登录失败【' + login_res.data.message + '】',
//                     showCancel: false,
//                     confirmText: '重试',
//                     success: function () {
//                       appWechatLogin();
//                     }
//                   })
//                 }
//               },
//               complete: function (res) {
//                 // setTimeout(function () {
//                 //   wx.hideLoading()
//                 // }, 1000);
//               }
//             })
//           } else {
//             wx.showToast({
//               title: '微信授权登录失败',
//               icon: 'success',
//               duration: 2000
//             })
//           }
//         }
//       });

//     }
//   })
// }

//检查用户的鑫动账号登录
// function checkAppUserLogin() 
// {
//   var user_id = wx.getStorageSync('user_id');
//   if (!user_id || user_id == '' || user_id == 'undefined' || user_id == undefined) {
//     wx.redirectTo({
//       url: '/pages/loginBycode/loginBycode',
//     })
//     return false;
//   }
//   return true;
// }

//app的账号密码登录
function appUserLogin(e) 
{
  var that = this;
  var formData = e.detail.value;

  //手机号校验
  if (formData.account == '') {
    return wx.showModal({
      title: '错误提示',
      content: '手机号不能为空',
      showCancel: false
    })
  }

  if (formData.account.length != 11) {
    return wx.showModal({
      title: '错误提示',
      content: '手机号长度不够或者手机号错误',
      showCancel: false
    })
  }

  //密码不能为空
  if (formData.password == '') {
    return wx.showModal({
      title: '错误提示',
      content: '密码不能为空',
      showCancel: false
    })
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
  //console.log('form发生了submit事件，携带数据为：', submitData)
  wx.request({
    url: getApp().appHttpsDomain + '/wechatrun/user/login',
    data: submitData,
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log('密码登录结果', res)
      if (res.data.code == 200) {
        wx.setStorageSync('user_id', res.data.data.user_id);
        wx.setStorageSync('company_id', res.data.data.company_id);
        wx.setStorageSync('department_id', res.data.data.department_id);
        wx.setStorageSync('department_name', res.data.data.department_name);
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


//app账号的验证码登录
function appUserCodeLogin(e) {
  var that = this;
  var formData = e.detail.value;
  return true;
}


module.exports = {
  appUserLogin: appUserLogin,//密码登录页面的登录
}