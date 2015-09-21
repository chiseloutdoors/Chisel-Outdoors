var main = function() {
    
    /* Trail Nav */
    $('.map-btn').click(function(){
       
    });

    $('.photos-btn').click(function(){
       
    });

    $('.highlight-btn').click(function(){
       
    });

    $('.camp-btn').click(function(){
       
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
    

    /* Prep Nav and Slides */
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
    });

    $('.pubs-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#pubs-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.pubs-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.accomodations-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#accomodations-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.accomodations-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.transport-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#transport-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.transport-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });

    $('.airfare-btn').click(function(){
       var currentSlide = $('.active-slide-prep');
       var nextSlide = $('#airfare-slide');
       
       currentSlide.fadeOut(600).removeClass('active-slide-prep');
       nextSlide.fadeIn(600).addClass('active-slide-prep');

       var currentBtn = $('.active-btn');
       var nextBtn = $('.airfare-btn');

       currentBtn.removeClass('active-btn');
       nextBtn.addClass('active-btn');
    });
    /* End Prep Nav and Slides */


    /* Nearby Trails Slides */
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

$(document).ready(main);