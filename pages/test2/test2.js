var api = require("../../utils/api.js");


var point = [];
var that2;

function drawline() {
  that2.setData({
    polyline: [{
      points: point,
      color: '#99FF00',
      width: 10,
      dottedLine: false
    }]
  });
}

//获取经纬度
function getlocation() {
  var lat, lng;
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      lat = res.latitude;
      lng = res.longitude;
      point.push({ latitude: lat, longitude: lng });
      console.log(point);
    }
  });
}

const app = getApp()
Page({
  data: {
    polyline: [],
  },

  onLoad:function(){


   that2 = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that2.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      }
    });


  },

  start: function  () {
    this.timer = setInterval(repeat, 1000);
    function repeat() {
      console.log('re');
      getlocation();
      drawline();
    }
  },
  end:  function  () {
    console.log('end');
    clearInterval(this.timer);
  }


})