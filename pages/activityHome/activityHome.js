//index.js
//获取应用实例
var api = require("../../utils/api.js");
const app = getApp()

Page({
  data: {
    // activity_id: 11,
    activity_id: wx.getStorageSync('activity_id'),
    user_id: wx.getStorageSync('user_id'),
    rank:[]
  },
  //事件处理函数
  bindViewTap: function() {
    
  },

  onLoad: function () {
    // wx.request({
    //   url: 'https://www.xindongguoji.com/wechatrun/activity/hitcard?user_id=5286&activity_id=79&address_id=19&latitude=1&longitude=1',
    //   dataType: 'json',
    //   data: {
    //   },
    //   success: function (res) {
    //   },
    //   fail: function (res) { },
    // })

  },

  onShow : function () {
    let _this = this
    wx.request({
      url: api.rank_list,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id')
      },
      success: function (res) {

        _this.setData({
          rank: res.data.data
        })
      },
      fail: function (res) { },
    })
    // that.getActivityInfo();
  },


  toIcbcACtivityPage: function (e) {
    let _this=this

    wx.setStorageSync('activity_id', e.currentTarget.dataset.info.activity_id);
    wx.setStorageSync('company_id', e.currentTarget.dataset.info.company_id);

    wx.navigateTo({
      url: '/pages/active_passage/active_passage',
    })
  },




})
