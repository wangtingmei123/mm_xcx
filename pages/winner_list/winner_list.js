//index.js
//获取应用实例
const app = getApp()
var api = require("../../utils/api.js");
var numRead = require("../../library/myNumRead.js");

const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowWidth;
const rate = 750 / W;
const code_h = 482 / rate;


Page({
  data: {
    draw_num : '',
    winner_list : [],
    qishu: '',
    height:0,
    page_index:1,
    page_is_end:false,
    prize_list_id:'',
    info:[],
    activity_name:'',
    prize_start_time:'',
    prizearr:[]

  },

  onLoad: function () {
    let _this=this
    _this.getWinnerList().then((data) => {
      _this.getRankingList()

    })

    let boxHeight = H*2 - code_h;
    _this.setData({
      height: boxHeight
    })

  },




  getRankingList:function(){
    let _this=this

    //已经到底了
    if (_this.data.page_is_end == true) {
      return wx.showToast({
        title: '已经到底了',
      });
    }
    return new Promise(function (resolve, reject) {

    wx.request({
      url: api.winnerLists,
      dataType:'json',
      data:{
        activity_id: wx.getStorageSync('activity_id'),
        offset: _this.data.page_index,
        prize_list_id: _this.data.qishu

      },
      success:function(res){
        if(res.data.code==200){

          //根据页码做排重
          if (res.data.data[0].offset + 1 == _this.data.page_index) {
            return false;
          }
          var info = _this.data.info;
          if (res.data.data[0].info.length > 0) {
            info = info.concat(res.data.data[0].info);
          }
          _this.setData({
            info: info,
            // prize_start_time: res.data.data[0].prize_start_time,
            page_index: _this.data.page_index + 1,
            page_is_end: res.data.data[0].info.length < res.data.data[0].limit ? true : false,
          })

        }

      }
    })

    })
    
  },

  to_qi:function(e){


   this.setData({
     qishu: e.currentTarget.dataset.info,
     page_index:1,
     page_is_end:false,
     info:[],

   })

    this.getRankingList()

  },

  onShow : function () {
    var that = this;
  
  },

  //获取中奖名单
  getWinnerList: function () {
    let _this = this

    return new Promise(function (resolve, reject) {

    wx.request({
      url: api.winnerLists,
      dataType: 'json',
      data: {
        activity_id: wx.getStorageSync('activity_id'),
        offset: 1,
        prize_list_id: _this.data.qishu

      },
      success: function (res) {

        if (res.data.code == 200) {
        
          var prizearr=[]
          var prize_count = res.data.data[0].prize_count
          for (var i = prize_count;i>0;i--){
    
            let name = numRead.myNumRead(i)
           var aa={'id':i,'name':name}
            prizearr.push(aa)
          }
          

          var qishu = prizearr[0].id
          _this.setData({
            activity_name: res.data.data[0].activity_name,
            prize_count: res.data.data[0].prize_count,
            prize_start_time: res.data.data[0].prize_start_time,
            prizearr: prizearr,
            qishu: qishu
          })
          return resolve(prizearr.length)

        }



      }
    })

    })
  }

})
