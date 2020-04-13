// pages/active_passage/active_passage.js
var api = require("../../utils/api.js");
const CryptoJS = require('../../library/aes_util.js');  //引用AES源码js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity:'',
    active_but1:false,
    active_but2: false,
    active_but3: false,
    active_but4: false,
    act_lebgth:'',
    is_show:1,
    activity_id:'',
    current_step:0,
    is_standard:0,
    pize:false,
    to_app:false,
    act_id:25,  //中信的活动id
    actcs_id: 72,  //中信的测试活动id
    ghact_id: 26,     //工行的活动id
    ghactcs_id: 73,     //工行的测试活动id
    shanghcs_id: 76, //上海的测试活动id
    shangh_id: 79, //上海的活动id
    tishi:false,
    getPrizeDetails:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

   let _this=this
    _this.setData({
      activity_id: wx.getStorageSync('activity_id')
    })



    if (options.empe_no != undefined && options.dept_no != undefined ){

      var empo_no = CryptoJS.AesDecrypt(options.empe_no)
      var dept_no = options.dept_no
      var src = options.src

      console.log("ppppppp3")
      //aes 加密
      console.log('123456--aes 加密', CryptoJS.AesEncrypt('123456'))
      // 5A09AE89579945B7AB80A9DC08F66FAA
      //aes 解密
      console.log('123456--aes 解密', CryptoJS.AesDecrypt('5A09AE89579945B7AB80A9DC08F66FAA'))
      // 123456

      wx.request({
        url: api.createZxzqUser,
        data: {
          empo_no: empo_no,
          dept_no: dept_no,
          src: src
        },
        success: function (res) {
          console.log(res)

          if (res.data.code == 200) {

            if (res.data.data.activity_id == _this.data.act_id||res.data.data.activity_id == _this.data.actcs_id) {
              _this.setData({
                is_show: 2,
                to_app:true
              })

            }
        
            wx.setStorageSync('user_id', res.data.data.user_id);
            wx.setStorageSync('company_id', res.data.data.company_id);
            wx.setStorageSync('department_id', res.data.data.department_id);
            wx.setStorageSync('department_name', res.data.data.department_name);
            wx.setStorageSync('real_name', res.data.data.real_name);
            wx.setStorageSync('telphone', res.data.data.telphone);
            wx.setStorageSync('activity_id', res.data.data.activity_id);
            _this.request()
            _this.getWechatRunData()
            _this.zxgetLuckDrawInfo()
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            });
          }
        }
      })

    }else{
      _this.request()

      if (wx.getStorageSync('activity_id') == _this.data.shanghcs_id || wx.getStorageSync('activity_id') == _this.data.shangh_id) {
        _this.setData({
          is_show: 3,
        })
      }

      if (wx.getStorageSync('activity_id') == _this.data.act_id || wx.getStorageSync('activity_id') == _this.data.actcs_id) {
        _this.setData({
          is_show: 2
        })
        _this.zxgetLuckDrawInfo()
        _this.getWechatRunData()
      }
    }



  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this=this
    // _this.getWechatRunData()
    if (wx.getStorageSync('activity_id') == _this.data.act_id || wx.getStorageSync('activity_id') == _this.data.actcs_id){
      _this.zxgetLuckDrawInfo()
      _this.getWechatRunData()
    }
 
  },


  hide_tishi:function(){
    this.setData({
      tishi: false
    })

  },



  //中信获取当前抽奖详情数据
  zxgetLuckDrawInfo: function () {
    var that = this;
    wx.request({
      url: api.zxprizeType,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id')
      },
      success: function (res) {
         if(res.data.code==200){
        
           that.setData({
             is_standard: res.data.data.is_standard
           })
         }
      },
      complete: function (res) { }
    });
  },




  getWechatRunData: function () {
    //return false;
    var that = this;
    var res = wx.getSystemInfoSync();
    if (!wx.getWeRunData || !res.SDKVersion || res.SDKVersion < '1.2.0') {
      return wx.showModal({
        title: '错误提示',
        content: '手机暂不支持微信运动，请更新微信到最新版本。',
        showCancel: false
      });
    }
    wx.getWeRunData({
      success(res) {
        wx.request({
          url: api.get_rundata,
          dataType: 'json',
          data: {
            user_id: wx.getStorageSync('user_id'),
            sessionKey: encodeURIComponent(wx.getStorageSync('session_key')),
            encryptedData: encodeURIComponent(res.encryptedData),
            iv: encodeURIComponent(res.iv),
            is_encode: 1,
            // activity_id: wx.getStorageSync('activity_id'),
            // company_id: wx.getStorageSync('company_id'),
          },
          success: function (res) {
            // console.log('调用微信解密接口',res);
            console.log("pppp")
            console.log(res)

            if (res.data.code == 200) {
       
            that.setData({
              current_step: res.data.data.step_num,
            })

            } else if (res.data.code == 301) {
              //console.log('触发更新session_key')
              app.wechatLoginCallback = session_key => {
                that.getWechatRunData(that);
              }

              app.appWechatLogin();//如果获取步数时，session_key过期更新session_key即可。
            } else {

            }
          }
        })
      },
      fail(res) {
        if (res.errMsg.indexOf('auth deny') > 0) {
          return wx.getSetting({
            success(res) {
              if (res.authSetting['scope.werun'] == false) {
                wx.openSetting({
                  success(res) {
                    //console.log(res.authSetting,'状态');
                  }
                })
              }
            }
          })
        } else if (res.errMsg.indexOf('not support') > 0) {
          return wx.showModal({
            title: '错误提示',
            content: '您当前的设备部支持微信运动，请用手环或者其他软件同步步数到微信运动',
            showCancel: false
          });
        }

        return wx.showModal({
          title: '错误提示',
          content: '错误信息【' + res.errMsg + '】',
          showCancel: false
        });
      },
      complete(res) { }
    })
  },



  request:function(){
    let _this = this

    wx.request({
      url: api.activityInfo,
      data: {
        company_id: wx.getStorageSync('company_id'),
        activity_id: wx.getStorageSync('activity_id'),
        user_id: wx.getStorageSync('user_id'),

      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        var fun = res.data.data.fun
        var but_arr = []
        for (var i = 0; i < fun.length; i++) {
          if (fun[i] == '活动排名') {
            _this.setData({
              active_but1: true,
            })
            but_arr.push(fun[i])
          }
          if (fun[i] == '活动打卡') {
            _this.setData({
              active_but2: true
            })
            but_arr.push(fun[i])
          }
          if (fun[i] == '活动抽奖') {
            _this.setData({
              active_but3: true
            })
            but_arr.push(fun[i])
          }
          if (fun[i] == '答题') {
            _this.setData({
              active_but4: true
            })
          }
        }

        if (but_arr.length == 1) {
          _this.setData({
            act_lebgth: 1
          })

        }


        if (wx.getStorageSync('activity_id') == _this.data.ghact_id || wx.getStorageSync('activity_id') == _this.data.ghactcs_id) {
          _this.setData({
            pize: true
          })
        }




        _this.setData({
          activity: res.data.data
        })

        wx.hideLoading()
      }
    })
  },



  to_ranklist:function(){
    wx.navigateTo({
      url: '/pages/ranking_list/ranking_list',
    })
  },

  to_luck:function(){
    wx.navigateTo({
      url: '/pages/scratch/scratch',
    })
  },

  to_chjiang: function () {
    wx.navigateTo({
      url: '/pages/luck_draw1/luck_draw1',
    })
  },


  to_quest:function(){
   let _this=this
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? date.getDate() : date.getDate();
    let today_time = Y + '/' + M + '/' + D

    wx.request({
      url: api.answer,
      data: {
        activity_id: wx.getStorageSync("activity_id"),
        user_id: wx.getStorageSync("user_id"),
        today_time: today_time

      },
      dataType: 'json',
      success: function (res) {

        if (res.data.data.answer_is_study==1){
          wx.navigateTo({
            url: '/pages/learning/learning'
          })

        } else if (res.data.data.answer_is_study == 2){

          wx.request({
            url: api.question,
            data: {
              activity_id: wx.getStorageSync("activity_id"),
              company_id: wx.getStorageSync("company_id"),
              user_id: wx.getStorageSync("user_id"),
              days:  '' ,
            },
            dataType: 'json',
            success: function (res1) {
  
              if (res1.data.code == 200) {
                wx.navigateTo({
                  url: "/pages/questions/questions?days='' "
                })
              } else if (res1.data.code == 500) {
                wx.showModal({
                  title: '提示',
                  content: res1.data.message,
                  showCancel: false,
                  success(res2) {
                    if (res2.confirm) {
                    }
                  }
                })

              }

            },
          })

        }
      }
    })
  },

  to_hitcard:function(){
    let _this=this

    if (wx.getStorageSync("activity_id") == _this.data.shangh_id||wx.getStorageSync("activity_id") == _this.data.shanghcs_id){
      wx.navigateTo({
        url: '/pages/shanghai_clock/shanghai_clock',
      })
    }else{
      wx.navigateTo({
        url: '/pages/hitcard1/hitcard1',
      })
    }

  },

  to_scratch:function(){
    let _this=this
    wx.navigateTo({
      url: '/pages/scratch/scratch?is_standard='+_this.data.is_standard,
    })
  },

  to_tribe: function () {
    console.log("****")
    wx.switchTab({
      url: '/pages/sports_tribe/sports_tribe',
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

  },
  launchAppError:function(e){
    console.log(e)
  }

})