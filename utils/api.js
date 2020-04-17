const root = "https://www.xindongguoji.com/";

// const root_test ="http://xdgj.com/index/";

const root_test = "https://www.xindongguoji.com/";

module.exports = {


  login: root + 'wechatrun/index/login',   //登录授权


  // 打卡页面
  getHitCardInfoNew: root+'wechatrun/activity/getHitCardInfoNew',

 //打卡
  hitcard: root +'wechatrun/activity/hitcard',  

 //获取打卡详情信息
  get_hitcardInfo: root + 'wechatrun/activity/getHitCardInfo',    

  // 判断该点是否打过
  isHitCard: root +'wechatrun/activity/isHitCard',



  // 手机号密码登陆页面
  login_user: root+'wechatrun/user/login',        

  // 手机号验证码登陆页面
  get_code: root + 'wechatrun/user/sendCode',       //获取验证码
  login_code: root+ 'wechatrun/user/codelogin',    //登陆


  //中信证券跳转小程序接口
  createZxzqUser: root +'Wechatrun/user/createZxzqUser',


// 中信个人成绩
  getPrizeDetails: root + 'Wechatrun/Goods/getPrizeDetails',




  // 首页
  get_rundata: root + 'wechatrun/index/weRunData',     //获取用户运动步数

  // 活动id
  get_activeid: root_test + 'wechatrun/activity/activeActivityInfo',     //获取用户活动id

// 活动专区列表页
  rank_list: root_test + 'Wechatrun/activity/list',

// 排名
  getRankingListBytype: root_test + 'Wechatrun/step/getRankingList',

// 获取排名列表
  activityRankingInfo: root_test + 'Wechatrun/activity/activityRankingInfo',

// 活动日历排名
  data_list: root_test + 'Wechatrun/activity/sportCalendar',

// 活动专区详情页
  activityInfo: root_test +'Wechatrun/activity/activityInfo',








  // 答题
  question:  root_test +'Wechatrun/step/answerInfo',    //答题

 // 答题完成
  answerEnd: root_test + 'Wechatrun/step/answerEnd',   

 // 答题入口
  answer: root_test + 'Wechatrun/step/answer',  //是否允许答题

  // 答题前学习页面
  studyInfo: root_test +'Wechatrun/step/studyInfo',  //是否允许答题

  // 中信证券答题完成接口
  zxstudy: root_test +'Wechatrun/step/ZXstudy',

  // 判断答题是否全部完成
  getGHanswer: root_test +'Wechatrun/step/getGHanswer',







  // 个人中心
  personalCenter: root_test +'Wechatrun/User/personalCenter',

  // 微信登录的信息
  getWeiHeader: root_test + 'Wechatrun/User/getWeiHeader',

  // 我的奖品
  myPrize: root_test +'Wechatrun/User/myPrize',

  //添加地址
  getAddress: root_test +'Wechatrun/User/addAddress',

  // 获取收货地址
  editAddressInfo: root_test + 'Wechatrun/User/editAddressInfo',

  // 编辑地址
  editAddress: root_test + 'Wechatrun/User/editAddress',

  // 积分抽奖奖项
  scorePrizeInfo: root_test + 'Wechatrun/User/scorePrizeInfo',

  // 兑换商品
  goodsExchange: root_test + 'Wechatrun/Goods/goodsExchange',

  // 积分抽奖
  scorePrizeBack: root_test + 'Wechatrun/User/scorePrizeBack',










  // 运动部落列表页
  sport_list: root_test + 'Wechatrun/Sport/list',

  // 运动部落列表页
  my_sport_list: root_test + 'Wechatrun/Sport/myList',

  // 运动部落详情页
  sport_details: root_test + 'Wechatrun/Sport/details',

  // 点赞详情页
  getPraiseDetails: root_test + 'Wechatrun/Sport/getPraiseDetails',

  // 点赞接口
  getPraise: root_test + 'Wechatrun/Sport/getPraise',

  // 评论接口
  getReply: root_test + 'Wechatrun/Sport/getReply',

  // 删除动态
  delArticle: root_test + 'Wechatrun/Sport/delArticle',

  // 上传图片
  uploadImage: root_test +'Wechatrun/Sport/uploadImage',

  // 发布动态
  insertArticle: root_test + 'Wechatrun/Sport/insertArticle',

  // 发表动态前选择活动
  articleInfo: root_test +'Wechatrun/Sport/articleInfo',

  // 图片验证
  validataImg: root_test + 'Wechatrun/Sport/validataImg',






  // 活动抽奖详情
  luckDraw: root_test + 'Wechatrun/step/luckDraw',

  //活动抽奖返回详情
  luckDrawBack: root_test + 'Wechatrun/step/luckDrawBack',  

  // 活动抽奖中奖名单
  winnerLists: root_test + 'Wechatrun/step/winnerLists',

  //中信证券抽奖详情
  zxprizeInfo: root_test +'Wechatrun/step/ZXprizeInfo',

 // 中信证券抽奖返回详情
  zxprize: root_test + 'Wechatrun/step/ZXprize',

// 中信证券抽奖类型
  zxprizeType: root_test + 'Wechatrun/step/ZXprizeType',


}

