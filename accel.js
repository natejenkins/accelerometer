$(document).ready(function(){
  console.info("adding event");
  $("#device-motion-status").text("supported")
  window.addEventListener('devicemotion', function(e) {
    var a = e.accelerationIncludingGravity;
    $("#x").text(a.x.toFixed(2))
    $("#y").text(a.x.toFixed(2))
    $("#z").text(a.x.toFixed(2))
  });
})();
