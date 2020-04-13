
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function parseParam (param, key) {
  var paramStr = "";
  if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    var k;
    for (k in param) {
      paramStr += '&' + k + '=' + param[k];
    }
  }
  return paramStr.substr(1);
};

//默认显示toast样式
function showToast(title, icon, duration){
  if (title = ''){ return false;}
  icon = icon == 'loading' ? 'loading' : 'success';
  duration = duration > 0 ? duration : 2000;
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
}

module.exports = {
  formatTime: formatTime,
  parseParam: parseParam,
}
