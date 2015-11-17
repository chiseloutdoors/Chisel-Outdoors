/*VARIABLES*/
var trailhead = {lat: 37.203467, lng: -113.641};
var placeType = ''; /*search keywords for radar search*/
var mapContainer = ''; /*where to place map in html*/



var main = function() {

    /* TRAIL NAV */
    $('.map-btn').click(function(){
       
    });

    $('.photos-btn').click(function(){
       
    });

    $('.highlight-btn').click(function(){
       
    });

    $('.camp-btn').click(function(){
       /*Map Search*/
       radarSearch(trailhead, 'camp_ground', "trail_map_canvas");
    });

    $('.water-btn').click(function(){
       
    });

    $('.forecast-btn').click(function(){
       
    });

    $('.community-btn').click(function(){
       
    });

    $('.hazards-btn').click(function(){
       
    });

    $('.activities-btn').click(function(){
       
    });

    $('.distance-btn').click(function(){
       
    });
    /* End Trail Nav */
    

    /* PREP MAP NAV */
    $('.services-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.services-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       radarSearch(trailhead, 'shop', "Prep_Map_Canvas")
    });

    $('.food-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.food-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'food|restaurant', "Prep_Map_Canvas");
    });

    /* Pubs */
    $('.pubs-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.pubs-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'bar', "Prep_Map_Canvas");
    });


    /* Accomodations */
    $('.accomodations-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.accomodations-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'lodging|rv_park', "Prep_Map_Canvas");
    });

    /* Transportation */
    $('.transport-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.transport-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'parking|gas_station', "Prep_Map_Canvas");
    });

    /* Airfare */
    $('.airfare-btn').click(function(){
       var currentBtn = $('.active-btn');
       var nextBtn = $('.airfare-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'airport', "Prep_Map_Canvas");
    });
    /* End Prep MAP Nav and Slides */

    /* PREP GEAR */
        $('.clothes-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#clothes-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.clothes-btn');

       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.pack-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#pack-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.pack-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    $('.sleep-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#sleep-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.sleep-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    $('.foodWater-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#foodWater-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.foodWater-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    $('.safety-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#safety-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.safety-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    $('.play-btn').click(function(){
       var currentSlide = $('.active-slide-gear');
       var nextSlide = $('#play-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.play-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-gear');
       nextSlide.fadeIn(600).addClass('active-slide-gear');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    /* END PREP GEAR */


    /* NEARBY TRAILS */
    $('.arrow-next').click(function(){
       var currentSlide = $('.active-slide-nearby');
       var nextSlide = currentSlide.next();
       
       var currentDot = $('.active-dot');
       var nextDot = currentDot.next();
       
       if(nextSlide.length == 0){
            nextSlide = $('.slide-nearby').first();
            nextDot = $('.dot').first();
       }
       
       currentSlide.fadeOut(600).removeClass('active-slide-nearby');
       nextSlide.fadeIn(600).addClass('active-slide-nearby');
       currentDot.removeClass('active-dot');
       nextDot.addClass('active-dot');  
    });

    $('.arrow-prev').click(function(){
       var currentSlide = $('.active-slide-nearby');
       var prevSlide = currentSlide.prev();
       
       var currentDot = $('.active-dot');
       var prevDot = currentDot.prev();
       
       if(prevSlide.length == 0){
            prevSlide = $('.slide-nearby').last();
            prevDot = $('.dot').last();
       }
       
       currentSlide.fadeOut(600).removeClass('active-slide-nearby');
       prevSlide.fadeIn(600).addClass('active-slide-nearby');
       currentDot.removeClass('active-dot');
       prevDot.addClass('active-dot'); 
    }); 
    /* End Nearby Trails Slides */
};


function radarSearch(trailhead, placeType, mapContainer){
  /*Create map search for "placeType" around trailhead*/
       var myOptions = {
        zoom: 10,
        center: trailhead,
        mapTypeId: google.maps.MapTypeId.ROADMAP
       };
       
       /*Set search map into corresponding slide*/ 
      var map = new google.maps.Map(document.getElementById(mapContainer), myOptions);

       /*"infoWindow" handles info of places returned from search*/
        infoWindow = new google.maps.InfoWindow();
        /*"Service" handles radar search results to find places*/
        service = new google.maps.places.PlacesService(map);

        // The idle event is a debounced event, so we can query & listen without
        // throwing too many requests at the server.
        map.addListener('idle', performSearch);
      
      /* Add trailhead marker */
      var marker = new google.maps.Marker({
        position: trailhead,
        map: map,
        title: 'Trail Head'
        });

      function performSearch() {
        var request = {
          keyword: placeType,
          location: trailhead,
          radius: 50000
        };
        service.radarSearch(request, callback);
      }
      
      function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        for (var i = 0, result; result = results[i]; i++) {
          addMarker(result);
        }
      }
      
      function addMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(10, 17)
          }
        });
      
        google.maps.event.addListener(marker, 'click', function() {
          service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
  
              infoWindow.setContent(result.name + "<br>" + result.formatted_address + "<br>" + result.formatted_phone_number + "<br>" + result.rating + "<br>" + result.url);
              infoWindow.open(map, marker);
            });
        });
      }

}

function distCalc (origin, destination) {
/* Calc distance between place and trailhead */
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      //transitOptions: TransitOptions,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false,
    }, callback);
  function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
  
      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = originList[i];
          var to = destinationList[j];
          var output = originList[i] + ' to ' + destinationList[j] +
            ': ' + results[j].distance.text + ' in ' +
            results[j].duration.text;

            return output;
        }
      }
    }
  }
}

$(document).ready(main);