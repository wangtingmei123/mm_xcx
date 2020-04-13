// pages/shanghai_clock/shanghai_clock.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    target_address_list:[],
    showFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  to_hit:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/hitcard/hitcard?address_id=' + e.currentTarget.dataset.info.address_id + '&&latitude=' + e.currentTarget.dataset.info.latitude + '&&longitude=' + e.currentTarget.dataset.info.longitude + '&&address_name=' + e.currentTarget.dataset.info.address_name,
    })

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
    let _this=this

    wx.request({
      url: api.getHitCardInfoNew,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id')
        },
        success:function(res){
              if(res.data.code==200){
                _this.setData({
                  target_address_list: res.data.data.target_address_list
                })
              }

        }
    })

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        _this.setData({
          showFlag: false
        })
      },
      fail(res){
        console.log("aaaa")
        console.log(res)
        if (res.errCode==2){
          wx.showModal({
            title: '错误提示',
            content: '请开启地理位置服务，否则无法使用打卡功能',
            showCancel: false
          });
        }else{
          wx.showModal({
            title: '错误提示',
            content: '请开启微信位置信息授权，否则无法使用打卡功能',
            showCancel: false
          });
          }

          return 

      }
    })

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
  onPullDownRefresh: function () {

  },

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