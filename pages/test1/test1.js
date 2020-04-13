var api = require("../../utils/api.js");
let Mcaptcha = require('../../library/base.js');
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 200 / rate;
const code_h = 80 / rate;
Page({
  data: {
    pwd:'',
    show_tip: false,
    code_w: code_w,
    code_h: code_h

  },

onReady: function () {
  var that = this;
  var num = that.getRanNum();
  // console.log(num)
  this.setData({
    num: num
  })
  new Mcaptcha({
    el: 'canvas',
    width: code_w,//对图形的宽高进行控制
    height: code_h,
    code: num
  });
},
getRanNum: function () {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var pwd = '';
  for (var i = 0; i < 4; i++) {
    if (Math.random() < 48) {
      pwd += chars.charAt(Math.random() * 48 - 1);
    }
  }
  return pwd;

},

  input_yzm:function(e){
    let value = e.detail.value
    let num=this.data.num
    if (value == num || value ==''){
      this.setData({
        show_tip:false
      })

    }else{
      this.setData({
        show_tip: true
      })
    }

  }

})