var main = function() {
  $('.clothes-btn').click(function() {
    $('.clothes-sub').animate({
      right: "0px"
    }, 200);

    /*$('.prep').animate({
      left: "285px"
    }, 200);*/
  });

  ('.icon-close').click(function() {
    $('.clothes-sub').animate({
      right: "-285px"
    }, 200);

    /*$('.prep').animate({
      left: "0px"
    }, 200);*/
  });

};

$(document).ready(main);