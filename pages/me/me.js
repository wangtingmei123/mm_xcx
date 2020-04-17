
var api = require("../../utils/api.js");// pages/me/me.js
var Charts = require('../../library/wxcharts.js');
var numRead = require("../../library/myNumRead.js");
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 680 / rate;
const code_h = 300 / rate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code_w: code_w,
    code_h: code_h,
    ch_data:[5,5,5,5,5,5],
    dang:4,
    user:null,
    now_num:2,
    all_num:0,
    frist:false,
    week:0,
    name_week:'',
    max:15000,
    main_data:[],
    nums:[],
    data_time:[],
    is_prize:'',
    user_id:0
  },

  to_login:function(){
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },

  to_login_l:function(){
    wx.navigateTo({
      url: '../loginBycode/loginBycode',
    })
  },
  to_luck: function () {
    wx.navigateTo({
      url: '../luck_draw1/luck_draw1',
    })
  },

  to_index:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */



  getSetting:function(){
    let that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
    
              that.setData({
                user: res.userInfo
              })
            }
          })
        }
      }
    })

  },



  onLoad: function (options) {


  },


 request:function(){
   let _this = this

   wx.request({
     url: api.personalCenter,
     dataType: 'json',
     data: {
       company_id: wx.getStorageSync('company_id'),
       user_id: wx.getStorageSync('user_id'),
       week: _this.data.week,
       activity_id: wx.getStorageSync('activity_id'),
     },
     success: function (res) {

      if(res.data.code==200){
        let name_week = numRead.myNumRead(res.data.data[0].week_nums - _this.data.week)

        _this.setData({
          all_num: res.data.data[0].week_nums,
          main_data: res.data.data[0],
          name_week: name_week,
          is_prize: res.data.data[0].is_prize,


        })

        var week_data = res.data.data[0].week_data

        var arr=[]
        var data_time=[]
        // console.log(JSON.parse(week_data))
        for (var i = 0; i < week_data.length;i++){

          var num = parseInt(week_data[i].nums) 
          var time = parseInt(week_data[i].data_time) 
          arr.push(num)
          data_time.push(time)
        }


        Array.prototype.max = function () {
          var max = this[0];
          var len = this.length;
          for (var i = 1; i < len; i++) {
            if (this[i] > max) {
              max = this[i];
            }
          }
          return max;

        }

        let max = arr.max()
        _this.setData({
          max: max,
          nums:arr,
          data_time: data_time
        })

        _this.charts()

      }else{
      
      }
      
     

     }

   })
 },

  charts:function(){
    let _this=this
    return new Promise(function () {

    new Charts({
      canvasId: 'columnCanvas',
      dataPointShape: false,
      type: 'column',
      legend: false,
      categories:_this.data.data_time,
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      series: [{
        name: '成交量1',
        data: _this.data.nums,
        color: "rgba(255,90,87,1)"
        // color: "rgba(254,129,84,1)"
      }
      ],
      yAxis: {
        disableGrid: false,
        gridColor: "#ffffff",
        fontColor: "#ffffff",
        min: 0,
        max: _this.data.max,
        disabled: true,
        fontColor: "#ff6700"
      },
      dataItem: {
        color: "#ff6700"
      },
      width: code_w,
      height: code_h,
      extra: {
        column: {
          width: 15
        },

      }

    })
    })
  },

  to_frist:function(e){
    let _this=this
    if (_this.data.week < _this.data.all_num-1){
      let week = _this.data.week+1
      _this.setData({
        week: week
      })
      _this.request()
    }

  },

  to_last: function (e) {
    let _this = this
    if (_this.data.week >0) {
      let week = _this.data.week - 1
      _this.setData({
        week: week
      })
      _this.request()
    }
  },




  //下拉刷新
  onPullDownRefresh: function () {
    this.request()
    // 隐藏导航栏加载框
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500)


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let _this = this
    if (wx.getStorageSync('user_id') == '' || wx.getStorageSync('user_id') == undefined) {
      _this.setData({
        user_id: 1
      })
    } else {
      _this.setData({
        user_id: 0
      })
    }


    _this.getSetting()

    _this.request()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})