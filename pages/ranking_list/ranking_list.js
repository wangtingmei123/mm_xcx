// pages/activity/icbc/ranking_list/ranking_list.js
var api = require("../../utils/api.js");
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750 / W;
const code_w = 260 / rate;
const code_h = 260 / rate;
const rnum = 130 / rate;
const rbanjin = 120 / rate;

Page({

  /**
   * 页面的初始数据
   * 

   
   */
  data: {
    ranking_type: '', //department_member all
    ranking_list : [],   //列表数据
    user_info: [],            //个人排行用户数据
    page_index: 1,            //当前页码
    page_size: 50,            //当前每页返回数据条数
    page_is_end: false,       //页面是否到底的标示
    scrollHeight: 500,        //排行滚动区域的大小

    progress_txt: '正在匹配中...',  
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    width_c: code_w,
    height_c: code_h,
    totap:1,
    da_show:false,
    qishu:5,
    rank:'',
    rank_ty:[],
    tapname:'',
    rili_show:false,
    paiming_show:false,
    mingci:false,
    canyul:false,
    act_id: 25,    //中信的活动id
    actcs_id: 72,  //中信的测试活动id
    ghact_id: 26,     //工行的活动id
    ghactcs_id: 73,     //工行的测试活动id
    user_infos:[],
    activity_id:'',
    shanghcs_id: 76,  //上海的测试活动id
    shangh_id: 79,   //上海的活动id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let _this=this

   _this.setData({
     activity_id: wx.getStorageSync('activity_id')
   })
    wx.showLoading({
      title: '加载中...',
    })

    _this.activityRankingInfo().then((data) => {
      _this.getRankingList()
    })
    _this.psone()

  },

  psone:function(){
    let that=this
    wx.request({
      url: api.getRankingListBytype,
      dataType: 'json',
      data: {
        ranking_type: 1,
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id'),
        activity_id: wx.getStorageSync('activity_id'),
        offset: 1,
        time: ''

      },
      success:function(res){
        console.log("个人排名")
          console.log(res)
          if(res.data.code==200){
            that.setData({
              user_info: res.data.data.user_info
            })
          }

      }

    })
  },

  activityRankingInfo:function(){
    let _this=this
    return new Promise(function (resolve, reject) {

    wx.request({
      url: api.activityRankingInfo,
      dataType:'json',
      data:{
        activity_id: wx.getStorageSync('activity_id'),
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id')
      },
      success:function(res){

        var ranking_types = res.data.data[0].ranking_types[0]
        var rank_ty=[]
        for (var i = 0; i < ranking_types.length;i++){

          if (ranking_types[i].id!=6){

            if (ranking_types[i].id == 2 && wx.getStorageSync('activity_id') == _this.data.ghact_id) {
              ranking_types[i].name = '步数排名'
            }
            if (ranking_types[i].id == 2 && wx.getStorageSync('activity_id')==_this.data.act_id){
              ranking_types[i].name='工会小组排名'
            }
            if (ranking_types[i].id == 5 && wx.getStorageSync('activity_id') == _this.data.act_id) {
              ranking_types[i].name = '参与率排名'
                _this.setData({
                  canyul: true
                })
            }
            rank_ty.push(ranking_types[i])
          }else{
            _this.setData({
              rili_show:true
            })
          }
      

        }




        _this.setData({
          rank:res.data.data[0],
          rank_ty: rank_ty,
          ranking_type: rank_ty[0].id,
          totap: rank_ty[0].id,
          tapname: rank_ty[0].name
        })

        return resolve(rank_ty.length)

      }
    })

    })
  },



  getRankingList: function () {
    var that = this;

    //已经到底了
    if (that.data.page_is_end == true) {
      wx.hideLoading()
      return
    }else{
      wx.showLoading({
        title: '加载中...',
      })
    }

    // if (that.data.page_index >=7 ) {
    //   return wx.showToast({
    //     title: '前300已展示完毕',
    //   });
    // }
    return new Promise(function (resolve, reject) {

    wx.request({
      url: api.getRankingListBytype,
      dataType: 'json',
      data: {
        ranking_type: that.data.ranking_type,
        user_id: wx.getStorageSync('user_id'),
        company_id: wx.getStorageSync('company_id'),
        activity_id: wx.getStorageSync('activity_id'),
        offset: that.data.page_index,//当前页码
        time: ''

      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.hideLoading()
          if (that.data.ranking_type!=4){

      
          //根据页码做排重
          if (res.data.data.page_index + 1 == that.data.page_index) {
            return false;
          }

          var ranking_data_ajax = that.data.ranking_list;

          if (res.data.data.ranking_list.length > 0) {
            ranking_data_ajax = ranking_data_ajax.concat(res.data.data.ranking_list);
          }

          that.setData({
            ranking_list: ranking_data_ajax,
            page_index: that.data.page_index + 1,
            page_is_end: res.data.data.ranking_list.length < res.data.data.page_size ? true : false,
            user_infos: res.data.data.user_info
          })

          
 
          }else{

            //根据页码做排重
            if (res.data.data.info[0].page_index + 1 == that.data.page_index) {
              return false;
            }

            var ranking_data_ajax = that.data.ranking_list;

            if (res.data.data.info[0].ret.length > 0) {
              ranking_data_ajax = ranking_data_ajax.concat(res.data.data.info[0].ret);
            }

            that.setData({
              ranking_list: ranking_data_ajax,
              page_index: that.data.page_index + 1,
              page_is_end: res.data.data.info[0].ret.length < res.data.data.info[0].page_size ? true : false,
              user_infos: res.data.data.user_info
            })
         
          }
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
          wx.hideLoading()
        }
      },
      complete: function (res) {

      }
    });

    })
  },








  to_data:function(){
    wx.navigateTo({
      url: '/pages/data_list/data_list',
    })
  },

  totap_ranklist:function(e){
    // console.log(e)
    wx.showLoading({
      title: '加载中...',
    })
    let that=this
    var tap = e.currentTarget.dataset.info.id
    var tapname = e.currentTarget.dataset.info.name
      this.setData({
        totap: tap,
        tapname:tapname,
        ranking_type: tap,
        ranking_list: [],
        page_index: 1,
        page_size: 50,
        page_is_end: false
      })
      that.getRankingList();
  
  },

  show_da:function(){
    this.setData({
      da_show: true
    })
  },

  hide_da:function(){
    this.setData({
      da_show:false
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */



  onReady: function () {

  },





  drawProgressbg: function () {

    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(5);// 设置圆环的宽度
    ctx.setStrokeStyle('#ff796c'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(rnum, rnum, rbanjin, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },




  countInterval: function () {

    var percent = 1
    //console.log('当前已走步数战圆圈的百分比', percent)
    percent = percent >= 1 ? 1 : percent;

    var i = 0;
    var t = setInterval(function () {
      // 页面渲染完成 
      var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。 
      cxt_arc.setLineWidth(5);
      // 设置渐变
      var gradient = cxt_arc.createLinearGradient(200, 200, 200);
      gradient.addColorStop("0", "#fdd765");
      gradient.addColorStop("0.5", "#fdd765");
      gradient.addColorStop("1.0", "#fdd765");
      // cxt_arc.beginPath();//开始一个新的路径 
      // cxt_arc.arc(rbanjin, rbanjin, rnum, 0.75 * Math.PI, 2.25 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径 
      // cxt_arc.stroke(); //对当前路径进行描边 

      cxt_arc.setStrokeStyle(gradient);
      // cxt_arc.setLineCap('round')

      if (percent != 0) {
        cxt_arc.beginPath();//开始一个新的路径 
        i += 0.01;
        if (i < percent) {
          cxt_arc.arc(rnum, rnum, rbanjin, -Math.PI / 2, i * 2 * Math.PI - Math.PI / 2, false);
        } else {
          cxt_arc.arc(rnum, rnum, rbanjin,  -Math.PI / 2, percent * 2 * Math.PI - Math.PI / 2, false);
          clearInterval(t);
        }

        cxt_arc.stroke();//对当前路径进行描边 
      }

      cxt_arc.draw();

    }, 25)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // this.countInterval()
    // this.drawProgressbg();

  },




})