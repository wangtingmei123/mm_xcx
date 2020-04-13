//联通定制场景页面
//获取应用实例
var api = require("../../utils/api.js");
const app = getApp()


Page({
  data: {
    
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '走进春天',
    })
  },

  //跳转到联通定制排行排行
  toCompanySort : function () {
    wx.navigateTo({
      //url: '/pages/companysort/companysort',
      url: '/pages/activity/china_unicom/china_unicom',
    })
  }

})
