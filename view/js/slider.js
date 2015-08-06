(function(){
  var slider = document.getElementById('slider1');
  var output = document.getElementById('slider1o');

  var input = slider.getElementsByTagName('input')[0];
  var root = document.documentElement;
  var dragging = false;
  var width = input.clientWidth / 2;

  var MIN_VALUE = 100;
  var TICK = (1000 - MIN_VALUE) / slider.clientWidth;

  var set_value = function (aRealValue){
    // calc slider size
    input.style.left = (aRealValue - input.clientWidth/2) + 'px';

    output.value =Math.round((TICK * aRealValue) + MIN_VALUE);
  };
  set_value(0);

  // On key up in the TextBox.
  output.onkeyup = function (evt) {
    //console.log(output.value);
  };

  // On click at the Scale.
  slider.onclick = function(evt){
    dragging = true;
    document.onmousemove(evt);
    document.onmouseup();
  };
  // Started to drag the mouse.
  input.onmousedown = function(evt){
    dragging = true;
  };
  // Ended to drag th mouse.
  document.onmouseup = function(evt){
    if (dragging) {
      dragging = false;
    }
  };
  // Dragging the mouse.
  document.onmousemove = function(evt){
    if(dragging){ // now Dragging..
      if(!evt){
        evt = window.event;
      }
      var left = evt.clientX;
      var rect = slider.getBoundingClientRect();
      // calc slider position.
      var real_value = Math.round(left - rect.left - width);

      // when over slider's width..
      if (real_value < 0 ) {
        real_value = 0;
      } else if (real_value > slider.clientWidth) {
        real_value = slider.clientWidth;
      }
      set_value(real_value);
    }
  };
})();
