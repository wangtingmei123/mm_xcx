var api = require("../../utils/api.js");
const app = getApp()

Page({
  data: {
    attend_num : 0, //已参加抽奖的总人数
    is_can_luck_draw : false,//用户是否能抽奖

    is_selected: 0, //当前用户是否中奖 0 未抽中 1 已抽中
    user_draw_status: 0,//用户是否当期已抽奖 0未抽 1已抽 2 用户未达标
    start_status: 0, //当前抽奖的状态 0未开始 1进行中 2已结束
    draw_image: '', ///static/images/mask2.png
    is_drawing : false,
    is_show_winner : false,
    list_show:true,
    standard_status:1,
    target_draw_num:'',
    prize_chance:'',
    prize_rule:'',
    is_issue:0,
    is_standard:'',
    act_id: 25     //中信的活动id
  },

  onLoad: function (options) {
    var that = this;
   
    if (options.is_standard!=undefined){
      that.setData({
        is_standard: options.is_standard
      })
    }


    if (wx.getStorageSync('activity_id') == that.data.act_id || wx.getStorageSync('activity_id') == 72){
      that.zxgetLuckDrawInfo()
   }else{
      that.getLuckDrawInfo()
   }

    that.init();

  },
  onShow: function () {


  },


  init(){
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.canvas').boundingClientRect(function (rect) {

      var width = rect.width;
      var height = rect.height;
      that.maskColor = '#dddddd';
      that.size = 8;
      that.r = that.size * 2;
      that.area = that.r * that.r; 
      that.scale =  0.75;
      that.totalArea = that.width * that.height;
      that.show = false;
      that.clearPoints = [];
      that.ctx = wx.createCanvasContext("canvas", that);
      that.drawMask(width,height);
    }).exec();
  },

  drawMask(width,height){
    let that = this;
    that.ctx.drawImage('../../static/images/images/11mask_03.png', 0, 0, width, height);
    that.ctx.draw()
    // wx.getImageInfo({
    //   src: 'https://www.xindongguoji.com/static/image/images/11mask_03.png',
    //   success(res) {
 
    //    console.log(res)
    //     // that.ctx.setFillStyle("#ff0000");
    //     // that.ctx.fillRect(0, 0, 300, 100);
    //     // that.ctx.draw();  
    //   }
    // })
 

  },
  mytouchstart(e){
    var that = this;
    if (that.data.is_can_luck_draw == false){
      return false;
    }
    if (that.data.is_drawing == true) {
      // return false;
    } else {
      if (wx.getStorageSync('activity_id') == that.data.act_id || wx.getStorageSync('activity_id') == 72){
        that.zxluckDraw()
      }else{
        that.luckDraw();
      }
 
    }

    this.eraser(e,true);
  },
  mytouchmove(e){
    var that = this;
    if (that.data.is_can_luck_draw == false) {
      return false;
    }
    this.eraser(e);
  },
  mytouchend(e){
    var that = this;
    if (that.data.is_can_luck_draw == false) {
      return false;
    }

    if(this.show){
      this.ctx.clearRect(0, 0,that.width,that.height);
      this.ctx.draw();
    }


  },
  eraser(e,bool){
    let that=this
    let len = this.clearPoints.length;
    let count = 0
    let x = e.touches[0].x, y = e.touches[0].y;
    let x1 = x - this.size;
    let y1 = y - this.size;
    if(bool){
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      })
    }
    for (let val of this.clearPoints){
      if(val.x1 > x || val.y1 > y || val.x2 < x || val.y2 < y){
        count++;
      }else{
        break;
      }
    }
    if(len === count){
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      })
    }
    if (this.clearPoints.length && this.r * this.r * this.clearPoints.length > this.scale * this.totalArea){
      this.show = true;
      that.setData({
        is_drawing: true
      });
    }
    this.ctx.clearRect(x1, y1, this.r, this.r);
    this.ctx.draw(true);
  },

  //返回活动主页
  toActivityHome : function() {
    wx.navigateBack({
      delta: 1
    })
  },

  toWinnerListPage: function () {
    wx.navigateTo({
      url: '/pages/winner_list/winner_list',
    })
  },

  //抽奖操作
  luckDraw : function() {
    var that = this;

      that.setData({
        is_drawing: true
      })
      wx.request({
        url: api.luckDrawBack,
        dataType: 'json',
        data: {
          user_id: wx.getStorageSync('user_id'),
          company_id: wx.getStorageSync('company_id'),
          activity_id: wx.getStorageSync('activity_id'),
          target_draw_num: that.data.target_draw_num,
          prize_chance: that.data.prize_chance,

        },
        success: function (res) {

          if (res.data.code == 200) {

            //抽中与否判断
            if (res.data.data[0].is_selected == 1) {
              console.log('恭喜您已抽中');
              that.setData({
                is_selected: res.data.data[0].is_selected,
                is_can_luck_draw: true,
                draw_image: '../../static/images/images/16mask3_03.jpg'
              })
            } else {
              console.log('很抱歉没抽中');
              that.setData({
                is_selected: res.data.data[0].is_selected,
                is_can_luck_draw: true,
                draw_image: '../../static/images/images/15mask_03.jpg'
              })
            }

          } else {
            return wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            });
          }
        },
        complete: function (res) {
          // that.setData({
          // is_drawing : false
          // })
        }
      });


  },

  //中信抽奖操作
  zxluckDraw: function () {
    var that = this;

    that.setData({
      is_drawing: true
    })
    wx.request({
      url: api.zxprize,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id'),
        is_standard: that.data.is_standard

      },
      success: function (res) {

        if (res.data.code == 200) {

          //抽中与否判断
          if (res.data.data[0].is_selected == 1) {
            console.log('恭喜您已抽中');
            that.setData({
              is_selected: res.data.data[0].is_selected,
              is_can_luck_draw: true,
              draw_image: '../../static/images/images/16mask3_03.jpg'
            })
          } else {
            console.log('很抱歉没抽中');
            that.setData({
              is_selected: res.data.data[0].is_selected,
              is_can_luck_draw: true,
              draw_image: '../../static/images/images/15mask_03.jpg'
            })
          }

        } else {
          return wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
        }
      },
      complete: function (res) {
        // that.setData({
        // is_drawing : false
        // })
      }
    });


  },

  //获取当前抽奖详情数据
  getLuckDrawInfo:function() {
    var that = this;
    wx.request({
      url: api.luckDraw,
      dataType: 'json',
      data: {
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id')
      },
      success: function (res) {
        if (res.data.code == 200) {
            that.setData({
              attend_num: res.data.data[0].luck_draw,//当前已有多少人抽奖
              // is_selected: res.data.data.is_selected, //当前用户是否中奖 0 未抽中 1 已抽中
              user_draw_status: res.data.data[0].has_selected,//用户是否当期已抽奖 0未抽 1已抽
              start_status: res.data.data[0].start_status, //当前抽奖的状态 1未开始 3进行中 2已结束
              standard_status: res.data.data[0].standard_status,   //1未达标 0已达标
              prize_rule: res.data.data[0].activity_info.prize_rule,
              is_issue: res.data.data[0].activity_info.is_issue

            })


          if (res.data.data[0].has_selected == 1) {
            // that.luckDraw()
            wx.showModal({
              title: '提示',
              content: '您已经抽过了哦',
              showCancel: false,
            })

          }
          if (res.data.data[0].start_status == 3 && res.data.data[0].standard_status == 0){
            that.setData({
              is_can_luck_draw : 1,//标记可抽奖状态
              target_draw_num: res.data.data[0].target_draw_num,
              prize_chance: res.data.data[0].prize_chance,
            })
       
          }
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success(res) {

            }
          })
        }
      },
      complete: function (res) {}
    });
  },

// 中信证券获取当前抽奖详情

  zxgetLuckDrawInfo: function () {
    var that = this;
    wx.request({
      url: api.zxprizeInfo,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id'),
        is_standard: that.data.is_standard
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            attend_num: res.data.data[0].luck_draw,//当前已有多少人抽奖
            // is_selected: res.data.data.is_selected, //当前用户是否中奖 0 未抽中 1 已抽中
            user_draw_status: res.data.data[0].has_selected,//用户是否当期已抽奖 0未抽 1已抽
            start_status: res.data.data[0].start_status, //当前抽奖的状态 1未开始 3进行中 2已结束
            standard_status: res.data.data[0].standard_status,   //1未达标 0已达标
            prize_rule: res.data.data[0].activity_info.prize_rule,
            is_issue: res.data.data[0].activity_info.is_issue

          })


          if (res.data.data[0].has_selected == 1) {
            // that.luckDraw()
            wx.showModal({
              title: '提示',
              content: '您已经抽过了哦',
              showCancel: false,
            })

          }
          if (res.data.data[0].start_status == 3 && res.data.data[0].standard_status == 0) {
            that.setData({
              is_can_luck_draw: 1,//标记可抽奖状态
              // target_draw_num: res.data.data[0].target_draw_num,
              // prize_chance: res.data.data[0].prize_chance,
            })

          }
          


        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success(res) {

            }
          })
        }
      },
      complete: function (res) { }
    });
  },






  close:function(){
    this.setData({
      start_status:9
    })
  }

})
