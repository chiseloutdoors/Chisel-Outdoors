function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.4931382, lng: -95.6150431},
    zoom: 5,
    disableDefaultUI:true
  });
  //var infoWindow = new google.maps.InfoWindow({map: map});

  var marker = new google.maps.Marker({
    position: {lat: 37.203467, lng: -113.641},
    map: map,
    title: 'Snow Canyon'
  });

  map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    /*window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);*/
  });

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
  
}
