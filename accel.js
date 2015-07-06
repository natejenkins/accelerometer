function vecLength(v){
  var lSquared = Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2);
  return Math.pow(lSquared, 0.5);
}

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
