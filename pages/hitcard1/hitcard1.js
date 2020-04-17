var api = require("../../utils/api.js");
const app = getApp()

//19068 刘洋

Page({

  data: {

    // 腾信地图坐标拾取器坐标  40.011680,116.396070  40.018390,116.393730   40.016910,116.394910
    target_address_list:
    [
        { "address_id": 1, "latitude": 40.011680, "longitude": 116.396070, "address_name": "A点森林小剧场北面草坪" },
        { "address_id": 2, "latitude": 40.016910, "longitude": 116.394910, "address_name": "B点朝花台站" }
    ],

    current_target_id : 0,
    current_address_info : [],
    start_card_time : 0,
    end_card_time : 0,
    time_counter_txt: '00:00:00',
    card_map : null,
    latitude: 0,  // 维度
    longitude: 0, //经度
    markers: [],   //地图标记点
    card_message : '',

    time_count_timer : null, //时间计时器
    distance_timer: null,    //计算距离计时器
    is_hitcardimg : false, //是否打卡中 避免重复操作
    is_get_hitcard_info : false,
    is_hit_card_end : false,
    enable_card_distance : 0.4,//可以打卡的距离设置
    suc_daka:false
  },


  close_suc:function(){
    this.setData({
      suc_daka:false
    })
  },
  //变更到新的地址
  changeToNewLocation : function () {
    var that = this;

    that.setData({
      latitude: that.data.target_address_list[that.data.current_target_id].latitude,
      longitude: that.data.target_address_list[that.data.current_target_id].longitude
    });
    
    //打开新的页面地图
    wx.openLocation({
      latitude: that.data.target_address_list[that.data.current_target_id].latitude,
      longitude: that.data.target_address_list[that.data.current_target_id].longitude,
    })

    //位置移动到新的地图
    //that.data.card_map.moveToLocation();
  },

  onReady: function () {
    var that = this;
    that.mapCtx = wx.createMapContext('card_map');
    that.setData({
      card_map: that.mapCtx
    })
  },

  onLoad: function () {
    var that = this;
    that.checkLocationAuth();
    that.getHitCardInfo();

    if (that.data.is_get_hitcard_info == false){
      console.log('初始化异步通知');
      app.initHitCardCallback = card_info => {
        that.initHitCard(card_info);
      }
    } else {
      that.initHitCard();
    }
    return false ; 
  },

  initHitCard : function (card_info) {
    var that = this;
  
    if (card_info.current_address_id > 0) {
      var current_target_id = parseInt(card_info.current_address_id) >= 1 ? 1 : 0;
    } else {
      var current_target_id = 0;
    }

    
    var mark_list = [];
    for (var i = 0; i < that.data.target_address_list.length; i++) {
      mark_list.push({ id: i + 1, latitude: that.data.target_address_list[i].latitude, longitude: that.data.target_address_list[i].longitude, name: that.data.target_address_list[i].address_name, iconPath: '/static/images/images/location.png' });
    }
    console.log('当前打卡地点，' + that.data.current_target_id, '异步回调' + current_target_id)
    that.setData({
      is_hitcardimg: false,
      markers: mark_list,
      current_target_id: current_target_id,
      latitude: that.data.target_address_list[current_target_id].latitude,
      longitude: that.data.target_address_list[current_target_id].longitude,
      current_address_info: that.data.target_address_list[current_target_id],
      is_hit_card_end: card_info.current_address_id == 2 ? true : false,
      card_message: card_info.current_address_id == 2 ? '您已完成打卡' : '',
    });

    //当前打卡已完毕，清除距离定时器
    if (card_info.current_address_id < 2) {
      that.distaceCounter();
    }

    if (card_info.current_address_id == 1) { //打完第一次卡开始开始计时
      that.timerCountUp(card_info.start_timestamp);
    } else if (card_info.current_address_id >= 2) { //打完第二次卡 写入倒计时
      //计算当前用户使用的倒计时
      var use_timestamp = card_info.end_timestamp - card_info.start_timestamp;
      console.log('打卡使用的时间戳',use_timestamp)
      var hour = parseInt(use_timestamp/ 3600);
      var min = parseInt(parseInt(use_timestamp % 3600) / 60);
      var second = parseInt(use_timestamp % 60);

      var time_txt = (hour > 0 ? (hour < 10 ? '0' + hour : hour) : '00') + ':' + (min > 0 ? (min < 10 ? '0' + min : min) : '00') + ':' + (second > 0 ? (second < 10 ? '0' + second : second) : '00')
      that.setData({
        time_counter_txt: time_txt
      })
    }
  },


  onShow: function () {

  },


  //用户打卡
  userHitcard : function() {
    var that = this;

 
    if (that.data.is_get_hitcard_info == false) {
      return false;
    }

    if (that.data.is_hit_card_end == true) {
      // wx.showToast({
      //   title: '您已打卡完毕',
      // });

      that.setData({
        suc_daka: true
      })
      return 

    }

    var data_obj = new Date();

    var year = data_obj.getYear(); //获取当前年份(2位)
    var year = data_obj.getFullYear(); //获取完整的年份(4位)
    var month = data_obj.getMonth()+1; //获取当前月份(0-11,0代表1月)
    var today = data_obj.getDate(); //获取当前日(1-31)
    var hours = data_obj.getHours(); //获取当前小时数(0-23)
    if (year == 2019 && month == 10 && (today == 26 || today == 27) && hours >= 8 && hours <13){

    var enable_card_distance = that.data.enable_card_distance;
    enable_card_distance = enable_card_distance <= 0 ? 0.5 : enable_card_distance;


    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var real_distanct = that.getDistance(res.latitude, res.longitude, that.data.current_address_info.latitude, that.data.current_address_info.longitude);
        if (real_distanct <= enable_card_distance) {
          that.setData({
            is_hitcardimg : true
          })
          
          wx.request({
            url: api.hitcard,
            dataType: 'json',
            data: {
              user_id: wx.getStorageSync('user_id'),
              activity_id: wx.getStorageSync('activity_id'),
              address_id: that.data.current_target_id +1, 
              latitude: res.latitude,
              longitude: res.longitude,
              image: ''
            },
            success: function (res) {
              console.log(res)
              if (res.data.code != 200) {
                return wx.showModal({
                  title: '错误提示',
                  content: '打卡失败【' + res.data.message + '】',
                  showCancel: false
                });
              }
              
              if (that.data.current_target_id == 0) { //第一个地点开始计时
                that.setData({
                  current_target_id: that.data.current_target_id + 1,
                  current_address_info: that.data.target_address_list[that.data.current_target_id + 1],
                  start_card_time: parseInt(data_obj.getTime() / 1000)
                })
                var current_time = parseInt((new Date()).getTime() / 1000);
                that.timerCountUp(current_time);
              } else if (that.data.current_target_id == 1) {
                //清除倒计时定时器
                if (that.data.time_count_timer) {
                  clearInterval(that.data.time_count_timer);
                }

                //清除距离定时器
                if (that.data.time_count_timer) {
                  clearInterval(that.data.distance_timer);
                }

                that.setData({
                  current_target_id: 0,
                  start_card_time: parseInt(data_obj.getTime() / 1000),
                  card_message: "您已完成打卡",
                  is_hit_card_end: true,
                })
              } else {
                that.setData({
                  current_target_id: that.data.current_target_id + 1,
                  current_address_info: that.data.target_address_list[that.data.current_target_id + 1],
                })
              }

              wx.setStorageSync('current_target_id', that.data.current_target_id);
              return wx.showToast({
                title: '打卡成功',
                duration: 4000
              });

            },
            fail : function(res) {
              console.log('打卡信息列表', res);
              return wx.showToast({
                title: '打卡失败',
                duration: 4000
              });
            },
            complete: function (res) {
              //wx.hideLoading();
              that.setData({
                is_hitcardimg: false
              })
            }
          });
        } else {
          return wx.showModal({
            title: '提示',
            content: '打卡失败，请在400米范围内打卡',
            showCancel: false
          });
        }
      },
      fail(res) {
        console.log("aaaa")
        console.log(res)
        if (res.errCode == 2) {
          wx.showModal({
            title: '错误提示',
            content: '请开启地理位置服务，否则无法使用打卡功能',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: '请开启微信位置信息授权，否则无法使用打卡功能',
            showCancel: false
          });
        }

        return
      }
    })

    }else{
      return wx.showModal({
        title: '提示',
        content: '不在打卡时间内',
        showCancel: false
      });
    }
  },

  //获取打卡详情信息
  getHitCardInfo : function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: api.get_hitcardInfo,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id'),
      },
      success: function (res) {
  
        if (res.data.code == 200) {
          console.log("**********")
          console.log(res.data.data)
          console.log(res)
          if (res.data.data.length > 0 ){
            console.log('打卡信息列表', res);
            that.setData({
              current_target_id: res.data.data.current_address_id, //当前的目标id 用于页面的标记及切换等
              current_address_id: res.data.data.current_address_id, //目前没什么用后期删除掉
              start_card_time: res.data.data.start_timestamp,
              end_card_time: res.data.data.end_timestamp,
              card_list_log: res.data.data.card_list,
              target_address_list: res.data.data.card_list,
              is_get_hitcard_info: true,
            })
          } else {
            that.setData({
              is_get_hitcard_info: true,
            })
          }
          
          if (app.initHitCardCallback) {
            //console.log('获取卡券异步回调');
            that.initHitCard(res.data.data); //首页获取步数回调
          }
        }
      },
      fail : function(res) {

      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },

  //距离计时器
  distaceCounter: function () {
    var that = this;
    var current_address_id = that.data.current_target_id;

    var distance_clock = setInterval(function () {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          var enable_card_distance = that.data.enable_card_distance;
          enable_card_distance = enable_card_distance <= 0 ? 0.5 : enable_card_distance;

          var real_distanct = that.getDistance(res.latitude, res.longitude, that.data.current_address_info.latitude, that.data.current_address_info.longitude)
          that.setData({
            card_message: '当前位置距离' + that.data.current_address_info.address_name + '【' + parseInt(real_distanct * 1000) + '】米' + (real_distanct <= enable_card_distance ? '，您可以打卡了' : '，请再走近些'),
          });
        },
        fail(res) {
          console.log("aaaa")
          console.log(res)
          if (res.errCode == 2) {
            wx.showModal({
              title: '错误提示',
              content: '请开启地理位置服务，否则无法使用打卡功能',
              showCancel: false
            });
          } else {
            wx.showModal({
              title: '错误提示',
              content: '请开启微信位置信息授权，否则无法使用打卡功能',
              showCancel: false
            });
          }

        }
      })
    }, 3000)

    that.setData({
      distance_timer: distance_clock
    })
  },

  //时间计时器
  timerCountUp: function (start_card_time) 
  {
    var that = this;
    var timer = setInterval(function(){
      var current_time = parseInt((new Date()).getTime()/1000);

      var hour = parseInt((current_time - start_card_time) / 3600);
      var min = parseInt(parseInt((current_time - start_card_time) % 3600) / 60);
      var second = parseInt((current_time - start_card_time) % 60); 

      var time_txt = (hour > 0 ? (hour < 10 ? '0' + hour : hour) : '00') + ':' + (min > 0 ? (min < 10 ? '0' + min : min) : '00') + ':' + (second > 0 ? (second < 10 ? '0' + second : second) : '00')
      that.setData({
        time_counter_txt: time_txt,
      })
    },1000);

    that.setData({
      time_count_timer: timer
    })
  },

  onUnload : function (){
    var that = this;
    //清除时间计数器
    if (that.data.time_count_timer) {
      clearInterval(that.data.time_count_timer);
    }

    //清除距离定时器
    if (that.data.distance_timer) {
      clearInterval(that.data.distance_timer);
    }
  },

  //计算两点间的距离 千米
  getDistance: function (la1, lo1, la2, lo2) 
  {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(4);
    return s;
  },


  checkLocationAuth : function(){
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log("aaaa")
        console.log(res)
        if (res.errCode == 2) {
          wx.showModal({
            title: '错误提示',
            content: '请开启地理位置服务，否则无法使用打卡功能',
            showCancel: false
          });
        } else {
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

  //挪动地图时触发
  regionchange: function () {
    console.log('regionchange');
  },

  //点击标点时触发
  markertap: function () {
    console.log('markertap');
  },

  //点击控件时触发
  controltap: function () {
    console.log('controltap');
  },

})