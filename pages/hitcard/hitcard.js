var api = require("../../utils/api.js");
const app = getApp()

//19068 刘洋

Page({

  data: {

    // 腾信地图坐标拾取器坐标  40.011680,116.396070  40.018390,116.393730   40.016910,116.394910

    current_target_id : 0,
    current_address_info : [],
    start_card_time : 0,
    end_card_time : 0,
    time_counter_txt: '00:00:00',
    card_map : null,
    latitude: 0,  // 维度
    longitude: 0, //经度
    card_message : '',
    distance_timer: null,    //计算距离计时器
    is_hitcardimg : false, //是否打卡中 避免重复操作
    is_get_hitcard_info : false,
    is_hit_card_end : false,
    enable_card_distance : 0.4,//可以打卡的距离设置
    suc_daka:false,
    address_name:'',
    address_id:0,
    tempFilePaths:[],
    cWidth: 0,
    cHeight: 0,
    is_choos:false,
    arr_url:[],
    markers: [],
    polyline:[]
  },


  close_suc:function(){
    this.setData({
      suc_daka:false
    })
  },
  //变更到新的地址
  changeToNewLocation : function () {
    var that = this;
    console.log(that.data.latitude)

    //打开新的页面地图
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
    })

    //位置移动到新的地图
    that.data.card_map.moveToLocation();
  },

  onReady: function () {
    var that = this;
    that.mapCtx = wx.createMapContext('card_map');
    that.setData({
      card_map: that.mapCtx
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      address_id: options.address_id,
      latitude: options.latitude,
      longitude: options.longitude,
      address_name: options.address_name
    })
    that.isHitCard();
    that.checkLocationAuth();
    that.distaceCounter();

      that.initHitCard();


  },


  initHitCard: function (card_info) {
    var that = this;

    var markers=[{
      id: that.data.address_id,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      width: 50,
      height: 50,
      iconPath: '/static/images/images/location.png',
      callout: {
        content: that.data.address_name,
        bgColor: "#fff",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#07c160",
        color: '#000',
        display:'ALWAYS'
      }
    }]

    that.setData({
      markers: markers
    });
 
  },


  onShow: function () {

  },


  //用户点击打卡
  userHitcard : function() 
  {
    var that = this;
    if (that.data.is_get_hitcard_info == false) {
      return false;
    }

    if (that.data.is_hitcardimg==true){
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
    var month = data_obj.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var today = data_obj.getDate(); //获取当前日(1-31)
    if (!(year == 2019 && month == 10 && today >= 21 && today < 31) && wx.getStorageSync('activity_id')==79){
      wx.showModal({
        title: '提示',
        content: '不在打卡时间内',
        showCancel: false
      });
      return
    }


    var enable_card_distance = that.data.enable_card_distance;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var real_distanct = that.getDistance(res.latitude, res.longitude, that.data.latitude, that.data.longitude);
        if (real_distanct <= enable_card_distance) {

          that.setData({
            is_hitcardimg : true,
            is_choos:true,
          
          }) 

        } else {
          return wx.showModal({
            title: '提示',
            content: '请在400米范围内打卡',
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


  },

  //判断
  isHitCard : function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: api.isHitCard,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id'),
        address_id: that.data.address_id
    
      },
      success: function (res) {
        console.log("**********")
        console.log(res.data.data)
      
        that.setData({
          is_get_hitcard_info: true
        })
        if (res.data.code == 200) {
        
        } else if (res.data.code == 500){
          that.setData({
            suc_daka: true,
            is_hit_card_end: true
          })
          return
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
 
    var distance_clock = setInterval(function () {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
     
          var enable_card_distance = that.data.enable_card_distance;
          // enable_card_distance = enable_card_distance <= 0 ? 0.5 : enable_card_distance;

          var real_distanct = that.getDistance(res.latitude, res.longitude, that.data.latitude, that.data.longitude)
          if (that.data.is_hit_card_end==false){
            that.setData({
              card_message: '当前位置距离' + that.data.address_name + '【' + parseInt(real_distanct * 1000) + '】米' + (real_distanct <= enable_card_distance ? '，您可以打卡了' : '，请再走近些'),
            });
          }else{
            that.setData({
              card_message: '您已完成打卡' 
            });
          }
     
        },
        fail(res) {
          that.setData({
            card_message: '获取GPS坐标失败',
          });



        }
      })
    }, 3000)

    that.setData({
      distance_timer: distance_clock
    })
  },



  onUnload : function (){
    var that = this;

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



// 检测位置服务是否开启

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






// 打卡

daka:function(){
  var that=this
  wx.getLocation({
    type: 'gcj02',
    success(res) {

      wx.request({
            url: api.hitcard,
            dataType: 'json',
            data: {
              user_id: wx.getStorageSync('user_id'),
              activity_id: wx.getStorageSync('activity_id'),
              address_id: that.data.address_id, 
              latitude: res.latitude,
              longitude: res.longitude,
              image: that.data.arr_url
            },
            success: function (res) {
              wx.hideLoading()
              console.log(res)
              if (res.data.code != 200) {
                return wx.showModal({
                  title: '错误提示',
                  content: '打卡失败【' + res.data.message + '】',
                  showCancel: false
                });
              }
          
              // wx.showToast({
              //   title: '打卡成功',
              //   duration: 2000
              // });

              that.setData({
                is_choos: false,
                suc_daka: true,
                is_hit_card_end: true
              })


            },
            fail : function(res) {
              console.log('打卡信息列表', res);
              return wx.showToast({
                title: '打卡失败',
                duration: 2000
              });
            },
            complete: function (res) {
              that.setData({
                is_hitcardimg: false
              })
            }
          });


    }
  })
   
},

      

  //选择图片并检测
  chooseimg: function () {

    let _this = this;
    let len = 0;
    if (_this.data.tempFilePaths != null) {
      len = _this.data.tempFilePaths.length;
    }
    wx.chooseImage({
      count: 9 - len, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.showLoading({
          title: '图片校验中...',
        })

        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            //---------利用canvas压缩图片--------------
            var ratio = 4;
            var canvasWidth = res.width //图片原始长宽
            var canvasHeight = res.height
            while (canvasWidth > 100 || canvasHeight > 100) {// 保证宽高在400以内
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            _this.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight
            })

            //----------绘制图形并取出图片路径--------------
            var ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function () {
              console.log("******")
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) {
                  console.log(res.tempFilePath)//最终图片路径

                  wx.uploadFile({
                    url: api.validataImg,
                    filePath: res.tempFilePath,
                    name: 'original_image',
                    formData: {
                      'user': 'test'
                    },
                    // method: 'post',
                    success(res) {

                      console.log(res.data)
                      var ss = JSON.parse(res.data);
                      console.log(ss)

                      if (ss.code == 200) {
                        console.log(tempFilePaths.length)

                        wx.hideLoading()

                        _this.setData({
                          tempFilePaths: tempFilePaths
                        })



                      } else {
                        wx.showModal({
                          title: '提示',
                          content: ss.message,
                          showCancel: false
                        })
                        wx.hideLoading()
                      }

                      //do something
                    },
                    fail() {
                      wx.showModal({
                        title: '提示',
                        content: '上传失败，请重新选择',
                        showCancel: false
                      })
                      wx.hideLoading()
                    }

                  })

                },
                fail: function (res) {
                  console.log("000")
                  console.log(res.errMsg)
                  wx.hideLoading()
                }
              })
            }, 800))    //留一定的时间绘制canvas
            // fail: function (res) {
            //   console.log(res.errMsg)
            // }
          }
        })


        console.log(_this.data.tempFilePaths)


      }
    })
  },



// 删除图片
  del_img: function (e) {
    let _this = this
    let img_index = e.currentTarget.dataset.index

    _this.data.tempFilePaths.splice(img_index, 1);
    _this.setData({
      tempFilePaths: _this.data.tempFilePaths
    })
  },



//点击提交按钮
  submit: function () {
    let _this = this
    if (_this.data.tempFilePaths.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先点击拍照',
        showCancel: false
      })

      return;
    }


      wx.showLoading({
        title: '正在提交...',
      })

      _this.tempFile()
        


  

  },


  // 提交图片
  tempFile: function(){
    var FSM = wx.getFileSystemManager(); 
    var _this = this
    let tempFilePaths = _this.data.tempFilePaths
    var arr_url=[]
    return new Promise(function (resolve, reject) {



      wx.getImageInfo({
        src: tempFilePaths[0],
        success: function (res) {
          //---------利用canvas压缩图片--------------
          var ratio = 2;
          var canvasWidth = res.width //图片原始长宽
          var canvasHeight = res.height
          while (canvasWidth > 400 || canvasHeight > 400) {// 保证宽高在400以内
            canvasWidth = Math.trunc(res.width / ratio)
            canvasHeight = Math.trunc(res.height / ratio)
            ratio++;
          }
          _this.setData({
            cWidth: canvasWidth,
            cHeight: canvasHeight
          })

          //----------绘制图形并取出图片路径--------------
          var ctx = wx.createCanvasContext('canvas')
          ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
          ctx.draw(false, setTimeout(function () {
            console.log("******")
            wx.canvasToTempFilePath({
              canvasId: 'canvas',
              destWidth: canvasWidth,
              destHeight: canvasHeight,
              success: function (res) {
                console.log(res.tempFilePath)//最终图片路径



                var arr_url=[]

                console.log(res.tempFilePath)
                let last = res.tempFilePath.lastIndexOf('.')
                let lasta = res.tempFilePath.slice(last + 1)
                  FSM.readFile({
                    filePath: res.tempFilePath,
                    encoding: "base64",
                    success: function (data) {
                      var tems = data.data
                      console.log(res.tempFilePath)

                      wx.request({
                        url: api.uploadImage,
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: 'post',
                        data: {
                          user_id: wx.getStorageSync('user_id'),
                          image: "data:image/" + lasta + ";base64," + tems,
                        },
                        success: function (res) {
                          console.log(res)

                          arr_url.push(res.data.data[0].image_url)

                          if (res.data.data[0].code == 0) {
                            console.log("++++")
                            _this.setData({
                              arr_url: arr_url
                            })
                          
                            _this.daka()
                      
                           
                          } else {
                            wx.hideLoading()
                            wx.showModal({
                              title: '错误提示',
                              content: res.data.data[0].desc,
                              showCancel: false,
                              success: function (res) { }
                            })
                          }

                        }

          

                      })

                    }
                  });


              },
              fail: function (res) {
                console.log("000")
                console.log(res.errMsg)
                wx.hideLoading()
              }
            })
          }, 800))    //留一定的时间绘制canvas
          // fail: function (res) {
          //   console.log(res.errMsg)
          // }
        }
      })

    
      })

 
  },

  ylimg: function (e) {
    let _this = this

    wx.previewImage({
      current: _this.data.tempFilePaths[0], // 当前显示图片的http链接
      urls: _this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },





})