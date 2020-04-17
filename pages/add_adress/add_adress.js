//index.js
//获取应用实例
// var app = getApp()
// var util = require('../../utils/util.js')
var api = require("../../utils/api.js");
var area = require('../../library/area.js')

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;

Page({
  data: {
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    choos:0,
    name:'',
    detailed_adress:'',
    phone:'',
    edit:0
  },
  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;


    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name
    })

  },


  onLoad: function (options) {
    var that = this;
    var date = new Date()

    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
   
      getProvinceData(that);
    });

    that.setData({
      edit: options.edit,
    })

    if (options.edit==1){

     
      that.setData({
        address_id: options.address_id,
        choos:1,
      
      })

      that.editAddressInfo()

    }


  },

  editAddressInfo:function(){
    let _this=this
     wx.request({
       url: api.editAddressInfo,
       dataType:'json',
       data:{
         address_id: _this.data.address_id,
         user_id: wx.getStorageSync('user_id')
       },
       success:function(res){
           _this.setData({
             province: res.data.data[0].province,
             city: res.data.data[0].city,
             county: res.data.data[0].district,
             name: res.data.data[0].consignee,
             detailed_adress: res.data.data[0].address,
             phone: res.data.data[0].mobile,
           })
       }
     })
  },
  
  name:function(e){
    this.setData({
      name: e.detail.value
    })
  },

  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  detailed_adress: function (e) {
    this.setData({
      detailed_adress: e.detail.value
    })
  },


  add_adress:function(){
  let _this=this
    if(this.data.name==''){
      wx.showModal({
        title: '提示',
        content: '请填写联系姓名',
        showCancel: false,
      })
      return
    }

    if (this.data.name.length < 2 || this.data.name.length > 5) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的姓名',
        showCancel: false,
      })
      return
    }

    if (this.data.phone == '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系电话',
        showCancel: false,
      })
      return
    }

    if (this.data.choos == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择所在地区',
        showCancel: false,
      })
      return
    }
    if (this.data.detailed_adress == '') {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false,
      })
      return
    }

    console.log(wx.getStorageSync('company_id') + wx.getStorageSync('user_id') + _this.data.name + _this.data.phone + _this.data.province + _this.data.city + _this.data.district + _this.data.detailed_adress)


    if (_this.data.edit == 0) {
    wx.request({
      url: api.getAddress,
      dataType:'json',
      data:{
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id'),
        consignee: _this.data.name,
        mobile: _this.data.phone,
        province: _this.data.province,
        city:_this.data.city,
        district: _this.data.county,
        address: _this.data.detailed_adress
      },
        success:function(res){
          if(res.data.code==200){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
              })
     
         setTimeout(function () {
           // 获取当前的页面栈
           let pages = getCurrentPages();
           // 获取上一级页面，即pageA的page对象
           let prevPage = pages[pages.length - 2];
           // 获取上一级页面，即pageA的data
           let prevPageData = prevPage.data;
           wx.navigateBack()
           //方法2：也可以直接调用上一级页面，即pageA的方法
           prevPage.onLoad();
         }, 1500)


       }else{
           wx.showToast({
             title: res.data.message,
             icon: 'none',
             duration: 1500
           })

          }
        }
      })

    } 
    
     if (_this.data.edit == 1){

       wx.request({
         url: api.editAddress,
         dataType: 'json',
         data: {
           address_id: _this.data.address_id,
           company_id: wx.getStorageSync('company_id'),
           user_id: wx.getStorageSync('user_id'),
           consignee: _this.data.name,
           mobile: _this.data.phone,
           province: _this.data.province,
           city: _this.data.city,
           district: _this.data.county,
           address: _this.data.detailed_adress
         },
         success: function (res) {
           if (res.data.code == 200) {
         
               wx.showToast({
                 title: '修改成功',
                 icon: 'success',
                 duration: 1500
               })
         

             setTimeout(function () {
               // 获取当前的页面栈
               let pages = getCurrentPages();
               // 获取上一级页面，即pageA的page对象
               let prevPage = pages[pages.length - 2];
               // 获取上一级页面，即pageA的data
               let prevPageData = prevPage.data;
               wx.navigateBack()
               //方法2：也可以直接调用上一级页面，即pageA的方法
               prevPage.onLoad();
             }, 1500)


           } else {
             wx.showToast({
               title: res.data.message,
               icon: 'none',
               duration: 1500
             })

           }
         }
       })
     }


 
  },





  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
   this.setData({
     choos:1
   })

    this.setData({
      province: provinces[index[0]].name,
      city: citys[index[1]].name,
      county: countys[index[2]].name
    })
  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  tiaozhuan() {
    wx.navigateTo({
      url: '../../pages/modelTest/modelTest',
    })
  }
})

//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);

    that.setData({
      province: "北京市",
      city: "市辖区",
      county: "东城区",
    })


}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}