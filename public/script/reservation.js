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




    // booking
    $(document).on('click', '#btnSubmitbooking', function(){
        $('#modal-handler .modal-add-booking').hide();
        $('#modal-handler .modal-confirm-booking').css('display', 'flex');
    });

    $(document).on('click', '#btnCancelBooking', function(){
        $('#modal-handler .modal-add-booking').css('display', 'flex');
        $('#modal-handler .modal-confirm-booking').hide();
    });

    $(document).on('click', '#btnYesBooking', function(){
        $('#modal-handler .modal-confirm-booking').hide();
        $('#modal-handler .modal-success-booking').css('display', 'flex');
    
        setTimeout(function() {
            $('#modal-handler .modal-success-booking').fadeOut();
            $('#modal-handler').fadeOut();
        }, 2000);
        
    });







    // view details{}

    $(document).on('click', '.reservation-page .page-container .page-reservation .reservation table tbody tr td:nth-child(8) a', function(event){
        event.preventDefault();

        $.ajax({
            url: '/modal-view-details',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').html(data);
            },
            error: function(err){
                console.error(err);
            }
        });
        
    });


});


