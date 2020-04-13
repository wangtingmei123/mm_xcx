// pages/tribal/tribal.js
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:[],
    font_num:0,
    color:'',
    maxlength:150,
    confirm_bar:false,
    content:'',
    arr_url:[],
    active_list:[],
    fen_item_name:'',
    fen_item_id:'',
    fen_gs_show:false,
    cWidth: 0,
    cHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.active_li()
  },

  bind_fen_item:function(e){
    let _this=this
    let fen_item = e.target.dataset.info;
    this.setData({
      fen_item_name: fen_item.activity_name,
      fen_item_id: fen_item.activity_id,
      fen_gs_show: !_this.data.fen_gs_show
    })
  },

  bing_fen_gs:function(){
    let _this=this
    this.setData({
      fen_gs_show: !_this.data.fen_gs_show
    })
  },


  active_li:function(){
    let  _this=this
    wx.request({
      url: api.articleInfo,
      dataType:'json',
      data:{
        company_id: wx.getStorageSync('company_id'),
        user_id: wx.getStorageSync('user_id'),
      },
      success:function(res){
        if(res.data.code==200){
           _this.setData({
             active_list:res.data.data,
             fen_item_name: res.data.data[0].activity_name,
             fen_item_id: res.data.data[0].activity_id
           })
        }
      }
    })
  },

  textarea_num:function(e){
    var cursor = e.detail.cursor
    this.setData({
      font_num: cursor,
      content: e.detail.value
    })

    if (cursor>=150){
      wx.showToast({
        title: '最多150个字哦',
        icon: 'none',
        duration: 1500
      })
    }
  },


  //上传图片
  chooseimg: function () {
    
    let _this = this;
    let len = 0;
    if (_this.data.tempFilePaths != null) {
      len = _this.data.tempFilePaths.length;
    }
    wx.chooseImage({
      count: 9 - len, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.showLoading({
          title: '图片校验中...',
        })


        getData(0, tempFilePaths.length)

        function getData(c, length) {
          wx.getImageInfo({
            src: tempFilePaths[c],
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
                       var ss= JSON.parse(res.data);
                        console.log(ss)

                        if (ss.code == 200) {
                          console.log(tempFilePaths.length)
                          console.log(c)
                          if (tempFilePaths.length == c + 1) {
                            wx.hideLoading()
                          }
                          var tempFilePathsimg = _this.data.tempFilePaths
                          var tempFilePathsimgs = tempFilePathsimg.concat(tempFilePaths[c])
                          _this.setData({
                            tempFilePaths: tempFilePathsimgs
                          })

                          if(++c<length){
                            getData(c, tempFilePaths.length)
                          }

                        

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
                          content: '上传失败，请重新上传',
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
              }, 400))    //留一定的时间绘制canvas
              // fail: function (res) {
              //   console.log(res.errMsg)
              // }
             }
            })

        }

        console.log(_this.data.tempFilePaths)
  

      }
    })
  },

  del_img:function(e){
    let _this = this
    let img_index= e.currentTarget.dataset.index

    _this.data.tempFilePaths.splice(img_index, 1); 
    _this.setData({
      tempFilePaths: _this.data.tempFilePaths
    })
  },



  submit:function(){
    let _this = this
    if (_this.data.content == '' && _this.data.tempFilePaths.length==0){
      wx.showModal({
        title: '提示',
        content: '不能发表空动态哦',
        showCancel: false
      })

      return;
    }


    wx.showLoading({
      title: '正在发表...',
    })
    



    if (_this.data.tempFilePaths.length==0){
      _this.confun()
    }else{
      _this.tempFile().then((data) => {
        _this.confun()

      })
    }
 
  },

  confun:function(){
    let _this=this
    return new Promise(function (resolve, reject) {
    wx.request({
      url: api.insertArticle,
      dataType:'json',
      data:{
        activity_id: _this.data.fen_item_id,
        user_id: wx.getStorageSync('user_id'),
        content: _this.data.content,
        image: _this.data.arr_url

      },
      success:function(res){
       if(res.data.code==200){
         wx.hideLoading()
   
        wx.showToast({
          title: '发表成功,审核中',
          icon: 'none',
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
         wx.hideLoading()
         wx.showModal({
           title: '提示',
           content: res.data.message,
           showCancel:false
         })

       }
      }
    })

      
    })
  },


  tempFile: function(){
    var FSM = wx.getFileSystemManager(); 
    let _this = this
    let tempFilePaths = _this.data.tempFilePaths
    var arr_url=[]
    return new Promise(function (resolve, reject) {
      submit(0)
       function submit(a){
         let last = tempFilePaths[a].lastIndexOf('.')
         let lasta = tempFilePaths[a].slice(last + 1)
         FSM.readFile({
           filePath: tempFilePaths[a],
           encoding: "base64",
           success: function (data) {
             var tems = data.data


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
                 console.log(a)
                 if (res.data.data[0].code == 0) {
                   arr_url.push(res.data.data[0].image_url)
                   if (arr_url.length == tempFilePaths.length) {

                     _this.setData({
                       arr_url: arr_url
                     })

                     return resolve(arr_url.length)

                   }

                   if (++a < tempFilePaths.length){
                     submit(a)
                   }
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
       }

      

    
 

    })
  },


  ylimg: function (e) {
    let _this = this
    let img_url = _this.data.tempFilePaths
    let index = e.currentTarget.dataset.index
    var arr_ul = []

    wx.previewImage({
      current: img_url[index], // 当前显示图片的http链接
      urls: img_url // 需要预览的图片http链接列表
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})