// pages/luck_list/luck_list.js
var api = require("../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    adress:[],
    dataUrls: [

    ],
    address_status:'',
    address_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    wx.request({
      url: api.myPrize,
      dataType:'json',
      data:{
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id')
      },
      success:function(res){

        _this.setData({
          dataUrls: res.data.data[0].user_prize_info,
          address_list: res.data.data[0].user_address,
          address_status: res.data.data[0].address_status,
        })

      }
    })

  },

  get_luck:function(e){
    let _this=this
    if (_this.data.address_status==0){
        wx.showModal({
          title: '提示',
          content: '请先填写收货地址',
          showCancel:false,
      })
    }else{

      let goods_id = e.target.dataset.info.prize_id
      let id = e.target.dataset.info.id

      wx.request({
        url: api.goodsExchange,
        dataType:'json',
        data:{
          company_id: wx.getStorageSync('company_id'),
          user_id: wx.getStorageSync('user_id'),
          address_id: _this.data.address_list.address_id,
          goods_id: goods_id,
          exchange_id: id
        },
        success:function(res){
          if(res.data.code==200){
            wx.showToast({
              title: '兑换成功',
              icon: 'success',
              duration: 1500
            })
            let index = e.currentTarget.dataset.index
            let dataUrls = _this.data.dataUrls
            dataUrls[index].is_exchange = 1
            _this.setData({
              dataUrls: dataUrls
            })

          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            })
          }
        }
      })



    }
  
 
  },

  add_adress:function(){
    wx.navigateTo({
      url: '/pages/add_adress/add_adress?edit=' + 0,
    })
  },

  edit_adress: function () {
    let _this=this
    wx.navigateTo({
      url: '/pages/add_adress/add_adress?edit=' + 1 + '&&address_id=' + _this.data.address_list.address_id
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