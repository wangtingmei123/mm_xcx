// pages/comments/comments.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    font_num:0,
    color: '',
    maxlength: 100,
    confirm_bar: false,
    article_id:'',
    content:'',
    size:'',
    tap_show:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let article_id = options.article_id
     var tap_show = ''
     var size=''

    if (options.tap_show!=undefined){
      tap_show = options.tap_show
    }
    if (options.size != undefined){
      size = options.size
    }


    this.setData({
      article_id: article_id,
      tap_show: tap_show,
      size: size
    })


  },

  textarea_num: function (e) {

    var cursor = e.detail.cursor
    this.setData({
      font_num: cursor,
      content:e.detail.value
    })

    if (cursor >= 100) {
      wx.showToast({
        title: '最多100个字哦',
        icon: 'none',
        duration: 1500
      })

    }
  },

  submit: function () {
    let _this=this
    if (_this.data.content.length==0){
      wx.showModal({
        title: '提示',
        content:'您没有填写任何评论，无法发表',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      })
    }

    wx.request({
      url: api.getReply,
      dataType: 'json',
      data: {
        article_id: _this.data.article_id,
        user_id: wx.getStorageSync('user_id'),
        content: _this.data.content,
      },
      success:function(res){
        if(res.data.code==200){
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1500
          })

          setTimeout(function () {
            // 获取当前的页面栈
            let pages = getCurrentPages();
            // 获取上一级页面，即pageA的page对象
            let prevPage = pages[pages.length - 2];
            // if(_this.data.size==1){
            //   prevPage.setData({                                      //修改上一个页面的变量
            //     id: _this.data.article_id,
            //     tap_show: _this.data.tap_show
            //   })
            // }
       
            // 获取上一级页面，即pageA的data
      

           
            if (_this.data.size == 1) {
              prevPage.setData({                                      //修改上一个页面的变量
                id: _this.data.article_id,
                tap_show: _this.data.tap_show,
                page_index:1
              })
              wx.navigateBack()
              prevPage.request();
            }else{
        
              wx.navigateBack()
              prevPage.onLoad();
            }
       

            //方法2：也可以直接调用上一级页面，即pageA的方法
        
          }, 1500)

        }else{
          wx.showModal({
            title: '提示',
            content: '评论失败',
            showCancel: false,
            success(res) {
              if (res.confirm) {
              }
            }
          })
        }
      }
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