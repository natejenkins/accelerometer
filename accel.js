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
  var totalPoints = 100;
  var acceleration = {x:0, y:0, z:0};
  var dataAX = makeArray(totalPoints, 0);
  var dataAY = makeArray(totalPoints, 0);
  var dataAZ = makeArray(totalPoints, 0);
  var dataVZ = makeArray(totalPoints, 0);
  var dataVX = makeArray(totalPoints, 0);
  var dataVY = makeArray(totalPoints, 0);
  var dataT  = makeArray(totalPoints, 0);
  var startTime = new Date().getTime();


  var updateInterval = 100;

  var plot = $.plot("#acceleration-plot", [_.zip(dataT, dataAX), _.zip(dataT, dataAY), _.zip(dataT, dataAZ)], {
    series: {
      shadowSize: 0
    },
    yaxis: {
      min: -15,
      max: 15
    },
    xaxis: {
      min: 0,
      max: 10
    }
  });

  var plot = $.plot("#velocity-plot", [_.zip(dataT, dataVX), _.zip(dataT, dataVY), _.zip(dataT, dataVZ)], {
    series: {
      shadowSize: 0
    },
    yaxis: {
      min: -15,
      max: 15
    },
    xaxis: {
      min: 0,
      max: 10
    }
  });

  function setPlotData(){

  }

  $(document).ready(function(){
    console.info("adding event");
    $("#device-motion-status").text("supported")
    window.addEventListener('devicemotion', function(e) {
      acceleration = e.accelerationIncludingGravity;
      var updateRate = e.interval;
      $("#x").text(acceleration.x.toFixed(2))
      $("#y").text(acceleration.y.toFixed(2))
      $("#z").text(acceleration.z.toFixed(2))
      $("#total").text(vecLength(acceleration).toFixed(2));
      $("#update-interval").text(updateRate);
    });
  });

  function update() {
    var time = (new Date().getTime() - startTime)/1000.0;
    var bufferPosition = bufferPosition + 1 % totalPoints;
    dataAX.shift();
    dataAY.shift();
    dataAZ.shift();
    dataT.shift();
    dataAX.push(acceleration.x);
    dataAY.push(acceleration.y);
    dataAZ.push(acceleration.z);
    dataT.push(time);
    window.dataAX = dataAX;
    window.dataAY = dataAY;
    window.dataAZ = dataAZ;
    window.dataT = dataT;
    plot.setData([_.zip(dataT, dataAX), _.zip(dataT, dataAY), _.zip(dataT, dataAZ)]);
    plot.draw();
    setTimeout(update, updateInterval);
  }

  update();
});


