// pages/questions/questions.js

var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_tip:false,
    quer2:'',
    daan:'',
    to_shoujiang:false,
    show_tip1:true,
    daan_q:2,
    requests:[],
    req_show:2,
    is_prize:'',
    days:'',
    today_time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    let days = options.days
    if (days!=''){
      _this.setData({
        days: days
      })
    }
    if (options.article_id!=undefined){
      _this.setData({
        article_id: options.article_id
      })
    }

    wx.request({
      url: api.question,
      data: {
        activity_id: wx.getStorageSync("activity_id"),
        company_id: wx.getStorageSync("company_id"),
        user_id: wx.getStorageSync("user_id"),
        days: _this.data.days,
        article_id: _this.data.article_id,
      },
      dataType: 'json',
      success: function(res) {

        if(res.data.code==200){
          _this.setData({
            requests: res.data.data,
            daan_q: res.data.data.true_answer

          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            confirmText:'返回',
            success(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })

        }
       
      },
    })

  },

  charge2:function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      daan: index

    })
  },


  queding:function(){
    let that=this


    wx.request({
      url: api.answerEnd,
      data: {
        activity_id: wx.getStorageSync("activity_id"),
        company_id: wx.getStorageSync("company_id"),
        user_id: wx.getStorageSync("user_id"),
        days: that.data.days,
        true_answer: that.data.daan,
        article_id: that.data.requests.article_id,
        // today_time: that.data.today_time
      },
      dataType: 'json',
      success: function (res) {
        let jifen='';
        if (res.data.data.score>0){
          jifen = '积分+' + res.data.data.score
        }

        that.setData({
          show_tip: true,
          show_tip1: false,
          is_prize: res.data.data.is_prize,
          daan: that.data.requests.true_answer
        })

        if (res.data.data.true==1){
          wx.showToast({
            title: '答对啦！' + jifen,
            icon: 'none',
            duration: 1500
          })
        } else if (res.data.data.true == 0){
          wx.showToast({
            title: '答错啦！' + jifen,
            icon: 'none',
            duration: 1500
          })
        }

            setTimeout(function(){
              wx.navigateBack()
            },2500)


      },
    })


  
  },




  to_shoujiang:function(){
    wx.navigateTo({
      url: '/pages/luck_draw1/luck_draw1',
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