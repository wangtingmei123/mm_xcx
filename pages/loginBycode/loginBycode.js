//index.js
//获取应用实例
var api = require("../../utils/api.js");
const app = getApp()

Page({
  data: {
    account: '',
    sendCodeButtonTxt: '发送验证码',
    time_limit: 60,
    timer_number: 0,
    is_sending_code : 0,
    valid_id : '',
    phone_tip:'',
    code_tip:'',
    code_show:false,
    tishi:true
  },

  hide_tishi:function(){
     this.setData({
       tishi:false
     })
  },

  to_tishi: function () {
    wx.switchTab({
      url: '/pages/me/me',
    })
  },

  onLoad: function () {
    
  },

  code_no:function(){
    this.setData({
      code_show: !this.data.code_show
    })
  },


  //输入字符串是获取用户输入的字符
  userMobileInput: function (e) {
    var that=this
    var phone = e.detail.value
    if (phone==''){
      this.setData({
        phone_tip: '',
        account: e.detail.value

      })
      return
    } else if (phone.length !=11){
      this.setData({
        phone_tip: '手机号错误',
        account: e.detail.value

      })
      return
    }else{
      this.setData({
        phone_tip: '',
        account: e.detail.value

      })
    }

  },



  codeinput:function(e){
    var that = this
    var code = e.detail.value
    if (code == '') {
      this.setData({
        code_tip: '',
        code: e.detail.value

      })
      return
    } else if (code.length != 6) {
      this.setData({
        code_tip: '验证码错误',
        code: e.detail.value

      })
      return
    } else {
      this.setData({
        code_tip: '',
        code: e.detail.value

      })
    }
  },

  //发送验证码
  sendCode: function (e) {
    var that = this;
    if (that.data.account == '') {
      that.setData({
        phone_tip:"手机号不能为空"
      })
      return

    } else if (that.data.account.length != 11){
      that.setData({
        phone_tip: "手机号错误"
      })
      return
    }

    //避免按钮双击
    if (this.data.is_sending_code === 1) {
      return false;
    }
    that.setData({ is_sending_code:1});
    var timer = setInterval(function () {
      that.setData({ is_sending_code: 0 });
      clearInterval(timer);
    }, 5000);

    //验证码一分钟发送次数校验
    if (this.data.timer_number > 0) {
      return wx.showModal({
        title: '错误提示',
        content: '验证码一分钟之内只能发送一次',
        showCancel: false
      })
    }
    
    wx.request({
      url: api.get_code,
      data: { account: that.data.account},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.setStorageSync('valid_id', res.data.data.valid_id);

          //验证码倒计时
          var timer_number = that.data.time_limit;
          var timer = setInterval(function () {
            timer_number -= 1;
            if (timer_number <= 0) {
              that.setData({
                sendCodeButtonTxt: '发送验证码',
                timer_number: 0,
              })
              return clearInterval(timer);
            }

            that.setData({
              sendCodeButtonTxt: timer_number + '秒',
              timer_number: timer_number,
              valid_id: res.data.data.valid_id,
            })
          }, 1000);

        } else {
          return wx.showModal({
            title: '错误提示',
            content: '验证码发送失败，请重试！',
            showCancel: false
          })
        }
      }, 
      complete: function (res) {
        
      }
    })
  },

  //表单提交处理
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;

    //手机号校验
    if (formData.account == '') {
      that.setData({
        phone_tip: "手机号不能为空"
      })
      return 
    }

    if (formData.account.length != 11) {
      that.setData({
        phone_tip: "手机号错误"
      })
      return 
    }


    //密码不能为空
    if (formData.code == '') {
      that.setData({
        code_tip: "验证码不能为空"
      })
      return 
    } else if (formData.code.length !=6) {
      that.setData({
        code_tip: "验证码错误"
      })
      return
    }
    // wx.showLoading({
    //   title: '登录中，请稍候',
    // })

    //formData.login_type = 'validate_login';
    formData.avatar = wx.getStorageSync('avatar');
    formData.valid_id = wx.getStorageSync('valid_id');
    formData.open_id = wx.getStorageSync('openid');
    formData.union_id = wx.getStorageSync('unionid');
    wx.request({
      url: api.login_code,
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.setStorageSync('user_id', res.data.data.user_id);
          wx.setStorageSync('real_name', res.data.data.real_name);
          wx.setStorageSync('telphone', res.data.data.telphone);

          if (that.wechatLoginCallback) {
            that.getWechatRunData(that); //首页获取步数回调
          }
          
          wx.switchTab({
            url: '/pages/index/index',
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
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 1000);
      }
    })
  },
  
})
