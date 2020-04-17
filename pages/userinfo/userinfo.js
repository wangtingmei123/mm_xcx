const api = require('../../utils/api.js')//引入可拼接的url
Page({
  data: {
    encryptedData: '',
    iv: '',
    site: '',
    info: '',
    radio_show: false
  },
  onLoad: function (options) {
    
  },

  to_radio:function(){
    this.setData({
      radio_show : !this.data.radio_show

    })

  },
  bindGetUserInfo: function (e) {
    console.log(e)
  wx.request({
    url: api.getWeiHeader,
    dataType:'json',
    data:{
      user_id: wx.getStorageSync('user_id'),
      openid: wx.getStorageSync('openid'),
      head_img: e.detail.userInfo.avatarUrl,
      wei_name: e.detail.userInfo.nickName
    },
    success:function(res){

      if(res.data.code==200){
        wx.reLaunch({
          url: '../me/me'
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false,
          success: function (res) { }
        })
    
      }

    }
  })

  return;


  },

})