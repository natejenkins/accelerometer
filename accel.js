function vecLength(v){
  var lSquared = Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2);
  return Math.pow(lSquared, 0.5);
}

function makeArray(length, defaultValue){
  var array = new Array(length);
  for(i=0; i<length; i++){
    array[i] = defaultValue;
  }
  return array;
}

$(function() {

  var dataAX = makeArray(length, 0);
  var dataAY = makeArray(length, 0);
  var dataAZ = makeArray(length, 0);
  var dataT  = makeArray(length, 0);
  var dataTAX = [[0,1], [1,3], [2,3]];
  var dataTAY = [[0,1], [1,4], [2,3]];
  var dataTAZ = [[0,1], [1,2], [2,3]];
  var startTime = new Date().getTime();
  totalPoints = 1000;

  var updateInterval = 500;

  var plot = $.plot("#acceleration-plot", [dataTAX, dataTAY, dataTAZ], {
    series: {
      shadowSize: 0
    },
    yaxis: {
      min: -15,
      max: 15
    },
    xaxis: {
      min: 0,
      max: 100
    }
  });

  function update() {
    var time = (new Date().getTime() - startTime)/1000.0;
    dataTAX = dataTAX.slice(1);
    dataTAX.push([time, 5]);
    plot.setData([dataTAX, dataTAY, dataTAZ]);
    plot.draw();
    setTimeout(update, updateInterval);
  }

  update();
});

$(document).ready(function(){
  console.info("adding event");
  $("#device-motion-status").text("supported")
  window.addEventListener('devicemotion', function(e) {
    var a = e.accelerationIncludingGravity;
    $("#x").text(a.x.toFixed(2))
    $("#y").text(a.y.toFixed(2))
    $("#z").text(a.z.toFixed(2))
    $("#total").text(vecLength(a).toFixed(2));
  });
});
