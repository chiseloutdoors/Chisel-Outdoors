/*VARIABLES*/
var trailhead = {lat: 50.820645, lng: -0.137376};
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
       radarSearch(trailhead, 'camp_ground', "map_canvas");
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
    

    /* PREP NAV */
    $('.clothes-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#clothes-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.clothes-btn');

       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.equipment-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#equipment-slide');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.equipment-btn');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');
      
       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.wildlife-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#wildlife-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.wildlife-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.info-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#info-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.info-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.services-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#services-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.services-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.food-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#food-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.food-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'food|restaurant', "food-slide");
    });

    /* Pubs */
    $('.pubs-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#pubs-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.pubs-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'bar', "pubs-slide");
    });


    /* Accomodations */
    $('.accomodations-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#accomodations-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.accomodations-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'lodging|rv_park', "accomodations-slide");
    });

    /* Transportation */
    $('.transport-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#transport-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.transport-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'parking|gas_station', "transport-slide");
    });

    /* Airfare */
    $('.airfare-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#airfare-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.airfare-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');

       /*Map Search*/
       radarSearch(trailhead, 'airport', "airfare-slide");
    });
    /* End Prep Nav and Slides */


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
        zoom: 15,
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
            infoWindow.setContent(result.name);
            infoWindow.open(map, marker);
          });
        });
      }

}

$(document).ready(main);