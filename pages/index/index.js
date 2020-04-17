//index.js
//获取应用实例
var api = require("../../utils/api.js");
const app = getApp()
var util = require("../../library/util.js");
var applogin = require("../../library/applogin.js");

const W = wx.getSystemInfoSync().windowWidth;
const rate = 750 / W;
const code_w = 520 / rate;
const code_h = 520 / rate;
const rnum = 250 / rate;
const rbanjin = 262 / rate
Page({
  data: {
    target_step: 10000,
    current_step: 0,
    current_date:'',
    is_show_activity : false,
    activity_id : 0,
    activity_name: '鑫动员工健步走活动',
    logo: '',
    logo_location: 1,
    // activity_id: 11,
    images: {},
    index: 0,
    width_c: code_w,
    height_c: code_h,
    target_walk:10000

  },

  onLoad: function (options) {
    this.drawProgressbg(); 

    wx.showLoading({
      title: '加载中',
    })

    this.checkAppUserLogin()


    console.log(options.tail)
    // if (options.tail==undefined){
    //   wx.redirectTo({
    //     url: '/pages/tail/tail',
    //   });
    // }
 wx.showShareMenu({
    withShareTicket: true
  })


    var that= this;
     
    var today = new Date();//当前时间 
    that.setData({
      current_date: today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate()
    });
    // that.getActivityInfo();
  },



  //检查用户的鑫动账号登录
  checkAppUserLogin: function () {
    var user_id = wx.getStorageSync('user_id');
    if (!user_id || user_id == '' || user_id == 'undefined' || user_id == undefined) {
      wx.redirectTo({
        url: '/pages/loginBycode/loginBycode',
      })
      return false;
    }
    return true;
  },



  onShow: function() {
    var that = this;
    //结果返回后重新刷新画布
    var user_id = wx.getStorageSync('user_id');
    if (!user_id || user_id == '' || user_id == 'undefined' || user_id == undefined) {
      app.wechatLoginCallback = session_key => {
        that.getWechatRunData(that);
      }
      
      wx.redirectTo({
        url: '/pages/loginBycode/loginBycode',
      });
    } else {
      if (wx.getStorageSync('session_key') == '' || wx.getStorageSync('session_key') == null ){
        //用户微信session过期时触发到
        app.wechatLoginCallback = session_key => {
          that.getWechatRunData(that);
        }
      } else {
        that.getWechatRunData(that);
      }
    } 
  },




  onReady: function () {
    let that=this
    // this.__drwCanvas(that);
    // this.countInterval()
  },





  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(9);// 设置圆环的宽度
    ctx.setStrokeStyle('#eee'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    // ctx.arc(rnum, rnum, rbanjin, -Math.PI / 2, 1.5 * Math.PI - Math.PI / 2, false);

    ctx.arc(rbanjin, rbanjin, rnum, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },



  drawCircle: function (step, i) {

    var percent = (70 / 100).toFixed(2);
    //console.log('当前已走步数战圆圈的百分比', percent)
    percent = percent >= 1 ? 1 : percent;
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#fdb34f");
    gradient.addColorStop("0.5", "#fe8154");
    gradient.addColorStop("1.0", "#ff5a57");

    context.setLineWidth(5);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')

    if (percent != 0) {
      context.beginPath();//开始一个新的路径 
      i += 0.01;
      if (i < percent) {
        context.arc(rnum, rnum, rbanjin, -Math.PI / 2, 1.5 * Math.PI - Math.PI / 2, false);
      } else {
        context.arc(rnum, rnum, rbanjin, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        clearInterval(t);
      }
      // cxt_arc.stroke();  //对当前路径进行描边 
    }

    context.stroke();
    context.draw()
  },



  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    var i = 0;
    this.countTimer = setInterval(() => {
      if (this.data.count <= 60) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (60 / 2), i)
        this.data.count++;
      } else {
        this.setData({
          progress_txt: "匹配成功"
        });
        clearInterval(this.countTimer);
      }
    }, 50)
  },









  //执行画布的动画操作
  __drwCanvas : function(that){

    // var percent = 1;

    var percent = (that.data.current_step / that.data.target_walk).toFixed(2);
    //console.log('当前已走步数战圆圈的百分比', percent)
    percent = percent >= 1 ? 1 : percent;
    
    var i = 0;
    var t = setInterval(function () {
      // 页面渲染完成 
      var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。 
      cxt_arc.setLineWidth(9);
      // 设置渐变
      var gradient = cxt_arc.createLinearGradient(200, 200, 200);
      gradient.addColorStop("0", "#fdb34f");
      gradient.addColorStop("0.5", "#fe8753");
      gradient.addColorStop("1.0", "#ff5a57");
      // cxt_arc.beginPath();//开始一个新的路径 
      // cxt_arc.arc(rbanjin, rbanjin, rnum, 0.75 * Math.PI, 2.25 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径 
      // cxt_arc.stroke(); //对当前路径进行描边 

      cxt_arc.setStrokeStyle(gradient);
      cxt_arc.setLineCap('round')

      if (percent != 0) {
        cxt_arc.beginPath();//开始一个新的路径 
        i += 0.01;
        if (i < percent) {
          cxt_arc.arc(rbanjin, rbanjin, rnum, -Math.PI / 2, i * 2 * Math.PI - Math.PI / 2, false);
        } else {
          cxt_arc.arc(rbanjin, rbanjin, rnum, -Math.PI / 2, percent * 2 * Math.PI - Math.PI / 2, false);
          clearInterval(t);
        }

        cxt_arc.stroke();//对当前路径进行描边 
      }

      cxt_arc.draw();

    }, 15)
  },
















  getWechatRunData : function () {
    var that = this;
    var res = wx.getSystemInfoSync();
    if(!wx.getWeRunData || !res.SDKVersion || res.SDKVersion < '1.2.0') {
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
            is_encode : 1,
         
          },
          success: function (res) {
            // console.log('调用微信解密接口',res);
            console.log("pppp")

            wx.hideLoading()
            if (res.data.code == 200) {
              that.setData({
                current_step: res.data.data.step_num,
                km_txt: res.data.data.km_txt,
                joule_txt: res.data.data.joule_txt,
                food_txt: res.data.data.food_txt,
                // activity_name: res.data.data.activity_name,
                logo: res.data.data.logo,
                logo_location: res.data.data.logo_location,
                company_name: res.data.data.title,
                target_walk: res.data.data.target_walk,
                activity_id: res.data.data.activity_id
                
              })
              wx.setStorageSync('activity_id', res.data.data.activity_id);
              wx.setStorageSync('company_id', res.data.data.company_id);
              wx.setStorageSync('department_id', res.data.data.department_id);
              wx.setStorageSync('department_name', res.data.data.department_name);
              that.__drwCanvas(that);//刷新画布
            } else if (res.data.code == 301) {
              //console.log('触发更新session_key')
              app.wechatLoginCallback = session_key => {
                that.getWechatRunData(that);
              }

              app.appWechatLogin();//如果获取步数时，session_key过期更新session_key即可。
            } else {
              that.__drwCanvas(that);//刷新画布
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
        // that.__drwCanvas(that);//刷新画布
        return wx.showModal({
          title: '错误提示',
          content: '错误信息【' + res.errMsg + '】',
          showCancel: false
        });
      },
      complete(res) { }
    })
  },






  //跳转到个人成绩页面
  toPersonalResult: function () {
    wx.navigateTo({
      url: '/pages/achieve/achieve',
    })
  },

  //跳转到活动详情页面
  toActivityInfo : function() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },

  //廊坊健步走
  toActivityLangfang: function () {
    wx.navigateTo({
      url: '/pages/activity/langfang/langfang',
    })
  },

  //2019北京融工公司春季健步活动跳转到排行页面
  toRankingList : function() {
    wx.navigateTo({
      url: '/pages/ranking_list/ranking_list',
    })
  },

  toIcbc_list:function(){
    wx.navigateTo({
      url: '/pages/activity/icbc/ranking_list/ranking_list',
    })
  },

  getActivityInfo : function(){
    var that = this;
    if (wx.getStorageSync('user_id') == '') {
      return false;
    }

    wx.request({
      url: api.get_activeid,
      dataType: 'json',
      data: {
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id'),
        department_id: wx.getStorageSync('department_id')
      },
      success: function (res) {
        console.log("ppp")
        console.log(res)
        if (res.data.code == 200) {
          if (res.data.data.is_china_unicom == 1){
            that.setData({
              is_show_activity : true,
              activity_id: res.data.data.activity_id,
            })
          }
          that.setData({
            activity_id: res.data.data.activity_id,
          })
          //标记活动id
          wx.setStorageSync('activity_id', res.data.data.activity_id)
        }
      },
      complete: function (res) {}
    });
  },

  //下拉刷新
  onPullDownRefresh: function(){
    // 显示顶部刷新图标
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading();
    var that = this;
    that.getWechatRunData(that);
    // 隐藏导航栏加载框
    setTimeout(function(){
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },1500)
   

  },


  imageLoad: function (e) {
    var width = e.detail.width,    //获取图片真实宽度
      height = e.detail.height,
      ratio = width / height;
    var viewHeight = 80,           //设置图片显示宽度，左右留有16rpx边距
      viewWidth =80 * ratio;
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },


 
})
