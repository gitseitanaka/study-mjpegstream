(function(){
  var slider = document.getElementById('slider1');
  var output = document.getElementById('slider1o');

  var input = slider.getElementsByTagName('input')[0];
  var root = document.documentElement;
  var dragging = false;
  var width = input.clientWidth / 2;

  var TICK = slider.clientWidth / 5000;
  var MIN_VALUE = 100;

  var set_value = function (aRealValue){
    // つまみのサイズ(input.clientWidth)だけ位置を調整
    input.style.left = (aRealValue - input.clientWidth/2) + 'px';

    output.value =Math.round((TICK * aRealValue) + 100);
    //output.value = output.value > MIN_VALUE ? output.value : MIN_VALUE;

  };
  set_value(0);

  // 目盛り部分をクリックしたとき
  slider.onclick = function(evt){
    dragging = true;
    document.onmousemove(evt);
    document.onmouseup();
  };
  // ドラッグ開始
  input.onmousedown = function(evt){
    dragging = true;
    return false;
  };
  // ドラッグ終了
  document.onmouseup = function(evt){
    if (dragging) {
      dragging = false;
    }
  };
  document.onmousemove = function(evt){
    if(dragging){
      // ドラッグ途中
      if(!evt){
        evt = window.event;
      }
      var left = evt.clientX;
      var rect = slider.getBoundingClientRect();
      // マウス座標とスライダーの位置関係で値を決める
      var real_value = Math.round(left - rect.left - width);
      // スライダーからはみ出したとき
      if (real_value < 0 ) {
        real_value = 0;
      } else if (real_value > slider.clientWidth) {
        real_value = slider.clientWidth;
      }
      set_value(real_value);
      return false;
    }
  };
})();
