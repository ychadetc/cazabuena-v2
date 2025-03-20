$(document).ready(function(){

    $(document).on('click', '#res-reservation', function(){
        $('.reservation-page .nav-slider .nav-tabs .slider-obj').css('left', '86px');
        $('.reservation-page .nav-slider .nav-tabs .slider-obj').css('width', '95px');
        $('.reservation-page .page-container .page-calendar').css('width', '0%');
        $('.reservation-page .page-container .page-reservation').css('width', '100%');
    });
    $(document).on('click', '#res-calendar', function(){
        $('.reservation-page .nav-slider .nav-tabs .slider-obj').css('left', '0px');
        $('.reservation-page .nav-slider .nav-tabs .slider-obj').css('width', '70px');
        $('.reservation-page .page-container .page-calendar').css('width', '100%');
        $('.reservation-page .page-container .page-reservation').css('width', '0%');
    });


});


