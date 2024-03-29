$(document).ready(function(){
  console.info("setting content")
  $("#content").height($(window).height());
  $(window).resize(function(){
    console.info("resizing");
    $("#content").height($(window).height());
  });
});


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
  var acceleration = {x:0., y:0., z:0.};
  var dataAX = makeArray(totalPoints, 0.);
  var dataAY = makeArray(totalPoints, 0.);
  var dataAZ = makeArray(totalPoints, 0.);
  var dataVZ = makeArray(totalPoints, 0.);
  var dataVX = makeArray(totalPoints, 0.);
  var dataVY = makeArray(totalPoints, 0.);
  var dataT  = makeArray(totalPoints, 0.);
  var avgAX=0.;
  var avgAY=0.;
  var avgAZ=0.;
  var avgCounter;
  var boolZeroing=false;
  var startTime = new Date().getTime();
  var oldTime = startTime;
  var newTime = startTime;
  var oldVx = 0., oldVy = 0., oldVz = 0.;
  var newVx = 0., newVy = 0., newVz = 0.;
  var xMin = 0.;
  var xMax = 20.;


  var updateInterval = 20;

  var plotA = $.plot("#acceleration-plot", [_.zip(dataT, dataAX), _.zip(dataT, dataAY), _.zip(dataT, dataAZ)], {
    series: {
      shadowSize: 0
    },
    yaxis: {
      min: -2,
      max: 2
    },
    xaxis: {
      min: xMin,
      max: xMax
    }
  });

  var plotV = $.plot("#velocity-plot", [_.zip(dataT, dataVX), _.zip(dataT, dataVY), _.zip(dataT, dataVZ)], {
    series: {
      shadowSize: 0
    },
    yaxis: {
      min: -2,
      max: 2
    },
    xaxis: {
      min: xMin,
      max: xMax
    }
  });

  $(document).ready(function(){
    console.info("adding event");
    $("#device-motion-status").text("supported")
    window.addEventListener('devicemotion', function(e) {
      if(e.acceleration){
        console.info("using acceleration");
        acceleration = {x: e.acceleration.x, y: e.acceleration.y, z: e.acceleration.z};
      }
      else{
        console.info("using accelerationIncludingGravity");
        acceleration = {x: e.accelerationIncludingGravity.x, y: e.accelerationIncludingGravity.y, z: e.accelerationIncludingGravity.z};
      }
      if(!boolZeroing){
        acceleration.x -= avgAX;
        acceleration.y -= avgAY;
        acceleration.z -= avgAZ;
      }
      window.avgAZ = avgAZ;
      window.acceleration = acceleration
      var updateRate = e.interval;
      $("#x").text(acceleration.x.toFixed(2))
      $("#y").text(acceleration.y.toFixed(2))
      $("#z").text(acceleration.z.toFixed(2))
      $("#total").text(vecLength(acceleration).toFixed(2));
      $("#update-interval").text(updateRate);
      if(boolZeroing){
        avgAZ += acceleration.z;
        avgAX += acceleration.x;
        avgAY += acceleration.y
        avgCounter += 1;
      }
    });
  });

  function stopZeroing(){
    console.info("stopzeroing");
    $("#zero-acceleration").text("Zero");
    if(avgCounter != 0){
      avgAZ = avgAZ/avgCounter;
      avgAY = avgAY/avgCounter;
      avgAX = avgAX/avgCounter;
      newVx = newVy = newVz = oldVx = oldVy = oldVz = 0;
    }
    console.info("avgCounter: " + avgCounter)
    console.info("avgAX " + avgAX)
    console.info("avgAY " + avgAY)
    console.info("avgAZ " + avgAZ)
    $("#avg-ax").text(avgAX);
    $("#avg-ay").text(avgAY);
    $("#avg-az").text(avgAZ);
    boolZeroing = false;
  }
  function startZeroing(){
    console.info("startzeroing");

    $("#zero-acceleration").text("zeroing");
    avgAZ = avgAY = avgAX = 0.0;
    console.info("avgAX " + avgAX)
    console.info("avgAY " + avgAY)
    console.info("avgAZ " + avgAZ)
    avgCounter = 0;
    boolZeroing = true;
    setTimeout(stopZeroing, 1000);
    
  }
  $("#zero-acceleration").click(function(e){
    console.info("button clicked");
    $("#zero-acceleration").text("preparing");
    setTimeout(startZeroing, 1000);
  });

  function update() {
    oldTime = newTime;
    newTime = new Date().getTime();
    oldVx = newVx;
    oldVy = newVy;
    oldVz = newVz;
    var deltaTime = (newTime - oldTime)/1000.0;
    // console.info("deltaTime: " + deltaTime);
    var time = (newTime - startTime)/1000.0;
    var bufferPosition = bufferPosition + 1 % totalPoints;
    dataAX.shift();
    dataAY.shift();
    dataAZ.shift();
    dataT.shift();
    dataAX.push(acceleration.x);
    dataAY.push(acceleration.y);
    dataAZ.push(acceleration.z);

    newVx = oldVx + acceleration.x*deltaTime;
    newVy = oldVy + acceleration.y*deltaTime;
    newVz = oldVz + acceleration.z*deltaTime;
    // console.info(newVz);
    dataVX.shift();
    dataVY.shift();
    dataVZ.shift();
    dataVX.push(newVx);
    dataVY.push(newVy);
    dataVZ.push(newVz);
    window.dataVZ = dataVZ;
    dataT.push(time);
    if(time>xMax){
      var xTemp = xMax;
      xMax += xMax - xMin;
      xMin = xTemp;
      plotA.getOptions().xaxes[0].min = xMin;
      plotA.getOptions().xaxes[0].max = xMax;
      plotA.setupGrid();
      plotV.getOptions().xaxes[0].min = xMin;
      plotV.getOptions().xaxes[0].max = xMax;
      plotV.setupGrid();
    }

    plotA.setData([_.zip(dataT, dataAX), _.zip(dataT, dataAY), _.zip(dataT, dataAZ)]);
    plotA.draw();
    plotV.setData([_.zip(dataT, dataVX), _.zip(dataT, dataVY), _.zip(dataT, dataVZ)]);
    plotV.draw();
    setTimeout(update, updateInterval);
  }

  update();
});


