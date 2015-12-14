$(document).mousemove(function(event) {
	cx = Math.ceil($(window).width() / 1.8);
    cy = Math.ceil($(window).height() / 1.8);
    dx = event.pageX - cx;
    dy = event.pageY - cy;

    tiltx = (dy / cy);
    tilty = - (dx / cx);

    $('#company').css('-webkit-transform','translate(' + dx + ', ' + dy + ')');
    //document.getElementById("logo").style.WebkitTransform = "translate("dx"px, "dx"px)";
    //document.getElementById("#logo").style.transform = "translate(dx',dy)";
    //$('#landing').css.webkitTransform= "translate(dx,dy)";
    //$('#landing').css('-webkit-transform','translatex('dx')');
    
});

function showCoords(event) {
    var x = event.pageX;//event.clientX;
    var y = event.pageY;//event.clientY;
    var coor = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("demo").innerHTML = coor;

    $('company').css.webkitTransform = 'translate('+x+', '+y+')';
}