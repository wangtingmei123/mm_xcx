var _drawCanvas = function (canvas_id, canvas_data) {

  var cxt_arc = wx.createCanvasContext(canvas_id);//创建并返回绘图上下文context对象。
  var eAngleNum = 0;

  var processColor = canvas_data.processColor//进度圆的颜色
  var circleColor = canvas_data.circleColor//进度整体圆的颜色
  var processBorder = canvas_data.processBorderWidth;//进度条的宽度
  var circleBorder = canvas_data.circleBorderWidth;//进度条背景的宽度
  //画圆的半径
  var circle_r = Math.min(parseFloat(canvas_data.width) - circleBorder, parseFloat(canvas_data.height) - circleBorder) / 2;
  var process_r = Math.min(parseFloat(canvas_data.width) - processBorder / 2, parseFloat(canvas_data.height) - processBorder / 2) / 2;

  var fontSize = canvas_data.fontSize;//字体的大小
  var fontColor = canvas_data.fontColor;//字体的颜色
  var center = {
    x: parseFloat(canvas_data.width +  processBorder) / 2,
    y: parseFloat(canvas_data.height + processBorder) / 2
  }

  var target_num = canvas_data.target_num;//进度的总目标
  var current_num = canvas_data.current_num;//进度的当前值
  var duration = canvas_data.duration;//执行动画时长

  //根据进度画圆
  if (current_num > 0){
    var startTime = Date.now();
    var timer = setInterval(function () {
      var precent_temp = Math.min(1.0, (Date.now() - startTime) / duration);   ///进度
      if (precent_temp >= 1) {
        clearInterval(timer);
        _draw(precent_temp);
      } else {
        _draw(precent_temp);
      }
    }, 17);
  } else {
    _draw(1);
  }
  

  function _draw(precent) {
    //console.log('时间分段', precent);

    cxt_arc.setLineWidth(circleBorder);
    cxt_arc.setStrokeStyle(circleColor);//#d2d2d2
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径
    cxt_arc.arc(center.x, center.y, circle_r, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径
    cxt_arc.stroke();//对当前路径进行描边
    cxt_arc.closePath();

    eAngleNum = Math.PI * ((current_num / target_num * 2) * precent - 0.5);

    //console.log('最终弧度', eAngleNum);

    if (current_num>0){
      cxt_arc.setLineWidth(processBorder);
      cxt_arc.setStrokeStyle(processColor);//#3ea6ff
      cxt_arc.setLineCap('round');
      cxt_arc.setLineJoin('round');
      cxt_arc.beginPath();//开始一个新的路径
      cxt_arc.arc(center.x, center.y, process_r, -Math.PI * 1 / 2, eAngleNum, false);
      cxt_arc.stroke();//对当前路径进行描边
      cxt_arc.closePath();
    }
    
    cxt_arc.setFillStyle(fontColor);
    cxt_arc.setFontSize(fontSize);
    var d = Math.ceil(current_num * precent);
    var fontDigit = d.toString().length;
    var centerx_patch = fontSize * fontDigit / 4 + (fontSize / 8) / 2;
    var centery_patch = (fontSize / 2) / 1.25;
    cxt_arc.fillText(d, center.x - centerx_patch, center.y + centery_patch);
    cxt_arc.closePath();

    cxt_arc.draw();
  }


}
module.exports = {
  draw: _drawCanvas
}





