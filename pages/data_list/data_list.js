var api = require("../../utils/api.js");
var numRead = require("../../library/myNumRead.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    sysW: null,
    lastDay: null,
    firstDay: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    year: null,
    to_day:'',
    height:0,
    state_mon:5,
    state_day:12,
    end_mon:6,
    end_day:22,
    data_rank:[],
    me_info:[],
    pass:'',
    ranking:'',
    arr_mon:[],
    year_state:'',
    now_mon:0,
    page_index:1,
    page_is_end:false


  },

  //当前日期特殊显示
  dataTime: function (year1,mon) {
    var date = new Date();
    var year2 = date.getFullYear();
    var mm1 = date.getMonth() + 1;//因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
    console.log(mm1)
    var tomon = parseInt(mon) + 1;
    console.log(tomon)

      this.setData({
        getDate: date.getDate()
      });

    let _this=this
    console.log(mon + "" + this.data.end_mon + "" + this.data.end_day + "" + date.getDate())



    if (year1 == _this.data.year_state && mon == _this.data.state_mon && _this.data.state_day > _this.data.getDate){
      _this.setData({
            getDate: _this.data.state_day
          });
        }

    if (year1 == year2 && mon == _this.data.end_mon && date.getDate() > _this.data.end_day) {
          console.log(date.getDate())
      _this.setData({
            getDate: _this.data.end_day
          });

    }


    // if()
    console.log("pppp")
    console.log(this.data.getDate)
  },



  onLoad: function (options) {
    let _this=this
    
    wx.showLoading({
      title: '加载中...',
    })
    var date = new Date();
    var tomon = date.getMonth();
    var year = date.getFullYear();

    let now_mon = _this.data.now_mon

    this.setData({
      to_day: tomon,
      page_index: 1,
      page_is_end: false,
      data_rank: []
    })

    function to_time() {
      return new Promise(function () {
        _this.dataTime(year,tomon)
        _this.transformationDate(year, tomon)
      })
    }

    _this.active_time().then((data) => {
      to_time().then(_this.to_request())

    })


  },


// 查看之前日期的排名
  to_show:function(e){

    if (e.target.dataset.info.show==false){
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var date = new Date();
    var taday = date.getDate();
    var dataw = e.target.dataset.info.name;
    var month = this.data.month;
 
    this.setData({
      getDate: e.target.dataset.info.name,
      page_index: 1,
      page_is_end: false,
      data_rank:[]
    });


    this.to_request()


  },

// 查看其它月份
  to_last:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    let _this=this
    let now_mon = _this.data.now_mon
    now_mon=now_mon-1

    let year = _this.data.arr_mon[now_mon].num
    var mon = _this.data.arr_mon[now_mon].id
    console.log(year+''+mon)
    this.setData({
      to_day: mon,
      now_mon: now_mon,
      page_index: 1,
      page_is_end: false,
      data_rank: []
    })
     function to_time(){
       return new Promise(function(){
         _this.dataTime(year,mon)
         _this.transformationDate(year, mon)
       })
     }

    to_time().then(_this.to_request())
 
  },

  to_next: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    let _this = this
    let now_mon = _this.data.now_mon
    now_mon = now_mon + 1

    let year = _this.data.arr_mon[now_mon].num
    var mon = _this.data.arr_mon[now_mon].id
    console.log(year + '' + mon)
    this.setData({
      to_day: mon,
      now_mon: now_mon,
      page_index: 1,
      page_is_end: false,
      data_rank: []

    })
    function to_time() {
      return new Promise(function () {
        _this.dataTime(year, mon)
        _this.transformationDate(year, mon)
      })
    }

    to_time().then(_this.to_request())
    // console.log(mon)

  },

  active_time:function(){
    let _this=this
    return new Promise(function (resolve, reject) {
    wx.request({
      url: api.activityInfo,
      dataType: 'json',
      data: {
        company_id: wx.getStorageSync('company_id'),
        activity_id: wx.getStorageSync('activity_id'),
        user_id: wx.getStorageSync('user_id'),

      },
      success: function (res) {


        let state_time = res.data.data.start_time
        let end_time = res.data.data.end_time
        let state_mon = parseInt(state_time.substring(5, 7))
        let state_day = parseInt(state_time.substring(8, 10))
        let end_mon = parseInt(end_time.substring(5, 7))
        // let end_mon = 3
        let end_day = parseInt(end_time.substring(8, 10))


        // 开始年份
        let year1 = parseInt(state_time.substring(0, 4))
        let year3 = parseInt(end_time.substring(0, 4))


        var date = new Date();
        var mon_end = date.getMonth()+1;
        var year2 = date.getFullYear();
  
        // if (year2 == year3 && parseInt(mon_end) > parseInt(end_mon)){
        //   mon_end = end_mon
        // }

        let mon_length = mon_end + (year2-year1)*12

        var arr_mon = []
        for (var i = state_mon; i <= mon_length; i++) {

          let num=i
          if(i>12){
            num=i-12
            year1 = year1+1
          }

          let name = numRead.myNumRead(num)
          let aa = { 'id': (num - 1), 'num': year1 , 'name' : name}
          arr_mon.push(aa)
        }

        _this.setData({
          state_mon: state_mon - 1,
          state_day: state_day,
          end_mon: end_mon - 1,
          end_day: end_day,
          arr_mon: arr_mon,
          year_state: year1,
          now_mon: arr_mon.length-1
  

        })

        return resolve (arr_mon.length)
      
      },
      fail: function (res) { },
    })
    })
  },

   to_request:function(){
 
    let _this=this
     if (_this.data.page_is_end == true) {
       wx.hideLoading()
      return

     }

     return new Promise(function () {
    
      let day = _this.data.getDate
       let mon = _this.data.arr_mon[_this.data.now_mon].id
       let year = _this.data.arr_mon[_this.data.now_mon].num
    
       let time = parseInt(year) + "-" + (parseInt(mon) + 1) + "-" + day

      wx.request({
        url: api.getRankingListBytype,
        dataType: 'json',
        data: {
          activity_id: wx.getStorageSync('activity_id'),
          user_id: wx.getStorageSync('user_id'),
          company_id: wx.getStorageSync('company_id'),
          time: time,
          offset: _this.data.page_index,
          ranking_type:6
        },
        success: function (res) {

          //根据页码做排重
          if (res.data.data.info[0].page_index + 1 == _this.data.page_index) {
            return false;
          }
          if(res.data.code==200){

            wx.hideLoading()
          var data_rank = _this.data.data_rank;
          if (res.data.data.info[0].ret.length > 0) {
            data_rank = data_rank.concat(res.data.data.info[0].ret);
          }


          _this.setData({
            data_rank: data_rank,
            pass: res.data.data.info[0].pass,
            ranking: res.data.data.info[0].ranking,
            page_index: _this.data.page_index + 1,
            page_is_end: res.data.data.info[0].ret.length < res.data.data.info[0].page_size ? true : false,

          })
 

          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
            wx.hideLoading()
          }
        },
        fail: function (res) { 
          wx.hideLoading()
          },
      })

    })
  },


  getRankingList:function(){
    wx.showLoading({
      title: '加载中...',
    })
    this.to_request()
  },

transformationDate: function (date, month){
  var _this=this;

    //最后一天是几号
      var last_mon = parseInt(month)
    var d = new Date(date, last_mon+1, 0);
      var s = d.getDate();

        //第一天星期几
     let firstDay = new Date(date, last_mon, 1);
      var a = firstDay.getDay();

      var arr1=[]
      var date1 = new Date();
      var taday = date1.getDate();
      var tomon = date1.getMonth() + 1;
      var year = date1.getFullYear()
      var aa;
   
      for (var i = 1; i < s + 1; i++) {
        aa = { name: i, show: true }
 

        if (date == _this.data.year_state && parseInt(month) == parseInt(_this.data.state_mon) && i < parseInt(_this.data.state_day)){
            aa = { name: i, show: false }
          }

          if (date == year && parseInt(month) == parseInt(tomon)-1 && i > parseInt(taday)) {
            aa = { name: i, show: false }
          }

        //   if (date == year && parseInt(month) == parseInt(_this.data.end_mon) && i > parseInt(_this.data.end_day)) {
        //     aa = { name: i, show: false }
        // }
   
        arr1.push(aa);

      }

    var res = wx.getSystemInfoSync();
    this.setData({
      sysW: res.windowWidth / 7,
      marLet: a,
      arr: arr1,
  
  });

  },

  strToDate: function (str) {
    var val = Date.parse(str);
    var newDate = new Date(val);
    return newDate;
  }





})
