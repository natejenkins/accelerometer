$(document).ready(function(){
  console.info("adding event");
  $("#device-motion-status").text("supported")
  window.addEventListener('devicemotion', function(e) {
    var acceleration = e.accelerationIncludingGravity;
    $("#x").text(acceleration.x)
    $("#y").text(acceleration.y)
    $("#z").text(acceleration.z)
  });
})();
