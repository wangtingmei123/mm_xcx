// pages/like_list/like_list.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like_list:[],
    article_id:'',
    page_index:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    let article_id = options.article_id
   _this.setData({
     article_id: article_id
   })

    _this.getPraiseDetails()
  },


  getPraiseDetails:function(){
    let _this=this
    if (_this.data.page_is_end == true) {
      return
    }
    wx.request({
      url: api.getPraiseDetails,
      dataType: 'json',
      data: {
        article_id: _this.data.article_id,
        page_index: _this.data.page_index
      },
      success: function (res) {

        //根据页码做排重
        if (res.data.data[0].page_index + 1 == _this.data.page_index) {
          return false;
        }

        let like_list = _this.data.like_list
        if (res.data.data[0].praise>0){
          like_list.concat(res.data.data[0].praise)
        }

        _this.setData({
          like_list: res.data.data[0].praise,
          page_index: _this.data.page_index+1,
          page_is_end: res.data.data[0].praise.length < res.data.data[0].page_size ? true : false

        })
      }
    })
  },


  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    this.getPraiseDetails()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})