// pages/sports_tribe/sports_tribe.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
      comms:[],
      show_all:'',
      tap_show:'all',
      page_index:1,
      page_is_end:false,
      is_circles:1,
      is_circle_show:false,
      toTop:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this
    this.setData({
      page_index: 1,
      comms: [],
  
      page_is_end: false,
    })
    this.request()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },







  chage_tap: function(e){
    let _this = this
    let tap_show = e.currentTarget.dataset.info
    this.setData({
      tap_show: tap_show,
      page_index:1,
      comms:[],
      page_is_end: false,
    })


    _this.request()

  },




  request: function () {
    let _this = this

    // if (_this.data.page_is_end == true) {
    //   wx.hideLoading()
    //   return
    // } else {
      wx.showLoading({
        title: '加载中...',
      })
    // }

    if (_this.data.tap_show == 'all') {
      wx.request({
        url: api.sport_list,
        dataType: 'json',
        data: {
          company_id: wx.getStorageSync('company_id'),
          user_id: wx.getStorageSync('user_id'),
          page_index: _this.data.page_index
        },
        success: function (res) {

          //根据页码做排重
          wx.hideLoading()
          if (res.data.data[0].page_index + 1 == _this.data.page_index) {
            return false;
          }
 
          let is_circles = res.data.data[0].is_circle;
          _this.setData({
            is_circles: is_circles

          })


          if (res.data.data[0].ret.length > 0) {

            let comms = _this.data.comms;
            let comm_all = res.data.data[0].ret
            comms = comms.concat(comm_all);
     
          _this.setData({
            comms: comms,
            page_index: _this.data.page_index + 1,
            page_is_end: res.data.data[0].ret.length < res.data.data[0].page_size ? true : false,
   
          })


          }

        }

      })
    } else if (_this.data.tap_show == 'me') {
      wx.request({
        url: api.my_sport_list,
        dataType: 'json',
        data: {
          company_id: wx.getStorageSync('company_id'),
          user_id: wx.getStorageSync('user_id'),
          page_index: _this.data.page_index
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.data[0].page_index + 1 == _this.data.page_index) {
            return false;
          }
          if (res.data.data[0].ret.length > 0) {

  

            let comms = _this.data.comms;
            let comm_all = res.data.data[0].ret
            comms = comms.concat(comm_all);

            _this.setData({
              comms: comms,
              page_index: _this.data.page_index + 1,
              page_is_end: res.data.data[0].ret.length < res.data.data[0].page_size ? true : false,

            })

          }

        }
      })
    }
  },

// 上拉加载
  onReachBottom: function () {
    let _this = this

    if (_this.data.page_is_end == true) {
      wx.hideLoading()
      return
    }
    this.request()

  },

  to_likea: function (e) {
    let _this = this
    if (_this.data.comms[0].is_circle == 0){
      wx.showModal({
        title: '提示',
        content: '您没有权限',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      })

      return
    }

    var falg=true;
    if (falg = true){
      falg = false;
      let praise_status = e.currentTarget.dataset.info;
      let article_id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let comm_all = this.data.comms;
      wx.request({
        url: api.getPraise,
        dataType: 'json',
        data: {
          active_id: wx.getStorageSync('activity_id'),
          article_id: article_id,
          user_id: wx.getStorageSync('user_id'),
          praise_status: praise_status,

        },
        success: function (res) {

          falg = true;
          if (res.data.code == 200) {

            if (praise_status == 1) {

              comm_all[index].praise_status = 2
              comm_all[index].praise_nums += 1

            } else if (praise_status == 2) {
              comm_all[index].praise_status = 1
              comm_all[index].praise_nums -= 1
            }
            _this.setData({
              comms: comm_all
            })
          }
          if (res.data.code == 300) {
            wx.showModal({
              title: '提示',
              content: res.data.data,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                }
              }
            })

          }
        }
      })
    }
   

  },

  
  to_pin: function (e) {
    let _this=this
    if (_this.data.comms[0].is_circle == 0) {
      wx.showModal({
        title: '提示',
        content: '您没有权限',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return
    }
    let article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/comments/comments?article_id=' + article_id,
    })
  },

  to_detil:function(e){
    let id = e.currentTarget.dataset.info
    let tap_show = this.data.tap_show
    wx.navigateTo({
      url: '/pages/tribe_detil/tribe_detil?tap_show=' + tap_show + '&&id=' + id,
    })
  },


  to_del:function(e){

    
    let index = e.currentTarget.dataset.index
    let article_id = e.currentTarget.dataset.id
    let _this=this
    wx.showModal({
      title: '提示',
      content: '确定要删除该条动态吗？',
      success(res) {
        if (res.confirm) {
        wx.request({
          url: api.delArticle,
          dataType:'json',
          data:{
            activity_id: wx.getStorageSync('activity_id'),
            user_id: wx.getStorageSync('user_id'),
            article_id: article_id

          },
          success:function(res){

            if(res.data.code==200){
              let comms = _this.data.comms
              _this.data.comms.splice(index, 1);

              _this.setData({
                comms: _this.data.comms,

              })

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              })

            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 1500
              })
            }
          }
        })

        } 
      }
    })
  },

  ylimg: function (e) {
     let _this=this
     let img_url = e.currentTarget.dataset.info
      let index = e.currentTarget.dataset.index
      var arr_ul=[]

    wx.previewImage({
      current: img_url[index], // 当前显示图片的http链接
      urls: img_url // 需要预览的图片http链接列表
    })
  },

  to_write:function(){
    wx.navigateTo({
      url: '/pages/tribal/tribal',
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
      let _this = this
      wx.showNavigationBarLoading();
      this.setData({
        page_index: 1,
        comms: [],
  
        page_is_end: false,
      })
      this.request()

    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500)

    },
 

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 监听滚动事件   scrollTop 滚动的距离
  onPageScroll: function (e) {
  let _this=this
    let toTop=false
    if (e.scrollTop>=300){
      toTop= true
  
    }else{
      toTop= false
      
    }

    _this.setData({
      toTop: toTop
    })

 
  },
  to_top:function(e){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})