// pages/learning/learning.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lears:[],
    tishi:false,
    tishi_lear: false,
     is_answer:'',
    today:-1,
    days:'',
    study_content:'',
    answer_image:'',
    is_show:1,
    is_bindtap:true,
    is_tested:0,
    act_id: 25,        //中信的活动id
    actcs_id: 72,  //中信的测试活动id
    ghact_id: 26,     //工行的活动id
    ghactcs_id: 73,     //工行的测试活动id
    langf_id: 24,          //廊坊的活动id
    shanghcs_id: 76,      //上海的测试活动id
    shangh_id: 79,      //上海的活动id
    study_num:0,
    huiz_show:false,
    is_over:0

  },


  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {


    wx.showLoading({
      title: '加载中...',
    })

    let _this = this
    _this.setData({
      tishi_lear:false
    })



    if (wx.getStorageSync('activity_id') == _this.data.langf_id) {
      _this.setData({
        is_bindtap: false
      })
    }



    var date = new Date();
    var day = date.getDate();
   
    if (wx.getStorageSync('activity_id') == _this.data.act_id || wx.getStorageSync('activity_id') == _this.data.actcs_id){
      _this.setData({
        is_show:2
      })
    }

    if (wx.getStorageSync('activity_id') == _this.data.shangh_id || wx.getStorageSync('activity_id') == _this.data.shanghcs_id) {
      _this.setData({
        is_show: 3
      })
    }

    wx.request({
      url: api.studyInfo,
      dataType: 'json',
      data: {
        activity_id: wx.getStorageSync('activity_id'),
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id'),
      },
      success: function (res) {

        wx.hideLoading()
        _this.setData({
          lears: res.data.data[0].answer,
          answer_image: res.data.data[0].answer_image,
          answer_rule: res.data.data[0].answer_rule,
          is_tested: res.data.data[0].is_tested,
          study_num: res.data.data[0].study_num,
          is_over: res.data.data[0].is_over,
        })

        let lears = res.data.data[0].answer
        for (var i = 0; i < lears.length; i++) {
          if (lears[i].is_today == 1) {
            _this.setData({
              today: i
            })
          }
        }

      }
    })

    if (wx.getStorageSync('activity_id') == _this.data.ghact_id || wx.getStorageSync('activity_id') == _this.data.ghactcs_id){

      _this.getGHanswer()

    }
  },

  hide_huiz:function(){
    this.setData({
      huiz_show: false
    })
  },


  getGHanswer:function(){
   let _this=this
    wx.request({
      url: api.getGHanswer,
      dataType: 'json',
      data: {
        activity_id: wx.getStorageSync('activity_id'),
        user_id: wx.getStorageSync('user_id'),
      },
      success:function(res){

        if (res.data.data.is_medal==1){
         _this.setData({
           huiz_show:true
         })
        }else{
          _this.setData({
            huiz_show: false
          })
        }
       

      }
    })

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  },

  hide_ts:function(){

    this.setData({
      tishi:!this.data.tishi
    })
  },

  show_lear: function (e) {
    let _this = this
    let sh_index = e.currentTarget.dataset.index + 1
    if ((wx.getStorageSync('activity_id') == _this.data.shangh_id || wx.getStorageSync('activity_id') == _this.data.shanghcs_id) && sh_index > _this.data.study_num){
      wx.showModal({
        title: '提示',
        content: '不符合答题条件',
        showCancel:false,
       
      })

      return
    }

    _this.setData({
      is_answer: e.currentTarget.dataset.info.is_answer,
      days: e.currentTarget.dataset.index+1,
      tishi_lear: !_this.data.tishi_lear,
      study_content: e.currentTarget.dataset.info.study_content,
      article_id: e.currentTarget.dataset.info.article_id,

    })


  },

  hide_lear:function(e){
    this.setData({
      tishi_lear: !this.data.tishi_lear
    })
  },


  to_lear:function(){
    let _this=this
    let index = parseInt(_this.data.days)
    let lears = _this.data.lears;
    wx.request({
      url: api.zxstudy,
      dataType: 'json',
      data: {
        activity_id: wx.getStorageSync('activity_id'),
        article_id: _this.data.article_id,
        user_id: wx.getStorageSync('user_id'),
        day_id:index
      },
      success: function (res) {
        if(res.data.code==200){
          
          lears[index - 1].is_answer = 1
          console.log(lears[index - 1].is_answer)
          _this.setData({
            tishi_lear: !_this.data.tishi_lear,
            lears: lears
          })
        }
      }
    })
    

 
  },



  to_quest:function(){
   
   let _this=this


    wx.request({
      url: api.question,
      data: {
        activity_id: wx.getStorageSync("activity_id"),
        company_id: wx.getStorageSync("company_id"),
        user_id: wx.getStorageSync("user_id"),
        days: _this.data.days,
        article_id: _this.data.article_id
      },
      dataType: 'json',
      success: function (res) {

        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/questions/questions?days=' + _this.data.days + '&&article_id=' + _this.data.article_id
          })
        } else if (res.data.code == 500) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
              }
            }
          })

        }

      },
    })





  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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