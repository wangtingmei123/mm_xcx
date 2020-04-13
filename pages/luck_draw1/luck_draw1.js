// pages/Lottery/Lottery.js
var api = require("../../utils/api.js");
Page({
  data: {
    last_index: 0,//上一回滚动的位置
    amplification_index: 0,//轮盘的当前滚动位置
    roll_flag: true,//是否允许滚动
    max_number: 8,//轮盘的全部数量
    speed: 300,//速度，速度值越大，则越慢 初始化为300
    finalindex: 5,//最终的奖励距离当前的位置！不是最后的几等奖！
    myInterval: "",//定时器
    max_speed: 40,//滚盘的最大速度
    minturns: 8,//最小的圈数为2
    runs_now: 0,//当前已跑步数
    luck_num: 3, //获得的奖项的位置
    end_amp:0, //上一次滚动的位置
    start_flag:true,
    lucks: [],
    dataUrls: [

    ],
    dataUrlsa:[] ,
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    integral:0,
    activity_id:'',
    is_selected:0,
    prize_name:'',
    is_display:1,
    show_display:false,
    show_ann:false,
    hide_ts: false,
    pize_rult:false,
    is_lu:0,
    tishi:false


  },


  hide_ts: function () {

    this.setData({
      tishi: !this.data.tishi
    })
  },


  //开始滚动
  startrolling: function () {
    let _this = this;

    if (_this.data.is_display==1){
      _this.setData({
        show_display: true
      })
      return
    }
    if (this.data.start_flag==true){
      _this.setData({
        start_flag: false
      })

    wx.request({
      url: api.scorePrizeBack,
      dataType:'json',
      data:{
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id'),
        activity_id: wx.getStorageSync('activity_id'),
      },
      success:function(res){

        if(res.data.code==200){
          _this.setData({
            is_selected: res.data.data[0].is_selected,
            luck_num: res.data.data[0].prize_num,
            prize_name: res.data.data[0].prize_name
          })

          //初始化步数
          _this.data.runs_now = 0;
          //当前可以点击的状态下
          if (_this.data.roll_flag) {
            _this.data.roll_flag = false;
            //启动滚盘，
            _this.rolling();
          }

        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            
          })

          _this.setData({
            start_flag: true
          })
        }
      }
    })

    }
  },




  onLoad:function(){

    wx.showLoading({
      title: '加载中...',
    })
    let _this=this
    this.scorePrizeInfo()
    if (wx.getStorageSync('activity_id')==26){
      _this.setData({
        pize_rult: true
      })
    }

  },

  close: function () {
    this.setData({
      show_display: false
    })
  },

  scorePrizeInfo:function(){
    let _this=this
    wx.request({
      url: api.scorePrizeInfo,
      dataType:'json',
      data:{
        activity_id: wx.getStorageSync('activity_id'),
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id'),
      },
      success:function(res){

        wx.hideLoading()
        _this.setData({
          lucks: res.data.data[0].prize_list,
          integral: res.data.data[0].integral,
          activity_id: res.data.data[0].activity_id,
          dataUrls: res.data.data[0].user_prize_info,
          is_display: res.data.data[0].is_display,
        })

  

        if (res.data.data[0].is_display==1){
          _this.setData({
            show_ann: true
          })
        }else{
          _this.setData({
            show_ann: false
          })
        }


        var array = _this.data.dataUrls
        var size = 5;
        function sliceArr(array, size) {
          var result = [];
          for (var x = 0; x < Math.ceil(array.length / size); x++) {
            var start = x * size;
            var end = start + size;
            result.push(array.slice(start, end));
          }
          return result;
        }


        var sliceArr = sliceArr(array, size)
        _this.setData({
          dataUrlsa: sliceArr
        })
      }
    })
  },

  onShow: function () {
    // this.data.min_height = getApp().globalData.windowheight;
    this.setData(this.data);
  },
  //滚动轮盘的动画效果
  rolling: function (amplification_index) {
    var _this = this;
   var myInterval = setTimeout(function () { _this.rolling(); }, this.data.speed);
    this.data.runs_now++;//已经跑步数加一
    this.data.amplification_index++;//当前的加一
    //获取总步数，接口延迟问题，所以最后还是设置成1s以上
    // var count_num = this.data.minturns * this.data.max_number + this.data.finalindex - this.data.last_index;
    var count_num = this.data.minturns * this.data.max_number + this.data.luck_num - this.data.end_amp;

    //上升期间
    if (_this.data.runs_now <= (count_num / 3) * 2) {
      _this.data.speed -= 30;//加速
      if (_this.data.speed <= _this.data.max_speed) {
        _this.data.speed = _this.data.max_speed;//最高速度为40；
      }
    }
    //抽奖结束
    else if (_this.data.runs_now >= count_num) {


      clearInterval(myInterval);
      _this.data.roll_flag = true;
      _this.setData({
       end_amp: _this.data.amplification_index,
       start_flag: true
     })

      if (_this.data.is_selected==0){
        // clearInterval(_this.data.myInterval);
        _this.setData({
          is_lu: 1
        })
      } else if (_this.data.is_selected == 1){
        _this.setData({
          is_lu: 1
        })

      }

      _this.onLoad()
       

    }
    //下降期间
    else if (count_num - _this.data.runs_now <= 10) {
      _this.data.speed += 20;
    }
    //缓冲区间
    else {
      _this.data.speed += 10;
      if (_this.data.speed >= 100) {
        _this.data.speed = 100;//最低速度为100；
      }
    }
    if (_this.data.amplification_index > _this.data.max_number) {//判定！是否大于最大数
      _this.data.amplification_index = 1;
    }
    _this.setData(_this.data);

  },



  luck_list:function(){
    wx.navigateTo({
      url: '/pages/luck_list/luck_list',
    })
  },

  to_hide_lu:function(){
    this.setData({
      is_lu: 0
    })
  }




})