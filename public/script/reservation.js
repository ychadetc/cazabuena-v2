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

    $(document).on('click', '#btnYesBooking', function(e){

        e.preventDefault();
        e.stopImmediatePropagation();
        
        


        var guestData = {
            "guest_id":$("#txtGuest").val(),
            "check_in_datetime":$("#txtCheckIn").val(), 
            "check_out_datetime":$("#txtCheckOut").val(),
            "special_request":$("#txtSR").val(),
            "no_pax":$("#txtNoPax").val(),
            "package":$("#txtPackage").val(),
            "bookingType":$("#txtBookingType").val(),
            "rate_no":$("#rate_no").val()
          }
            var JSONguestData = JSON.stringify(guestData);

            $.ajax({
                    url:"http://localhost:3000/InsertBooking",
                    type:"POST",
                    data:JSONguestData,
                    contentType:'application/json',
                    success: function(data){
                        $('#modal-handler .modal-confirm-booking').hide();
                        $('#modal-handler .modal-success-booking').css('display', 'flex');
                        setTimeout(function() {
                            $('#modal-handler .modal-success-booking').fadeOut();
                            $('#modal-handler').fadeOut();
                        }, 2000);
                    },
                    
                    error: function(xhr, status, error){
                        alert(error);
                    }

                })
    
        
        
    });







    // view details{}

    $(document).on('click', '.reservation-page .page-container .page-reservation .reservation .atag', function(event){
        event.preventDefault();

        var transaction_id2 = $(this).data('page');

        console.log(transaction_id2)

        const json_data = {"transaction_id2":transaction_id2};
        const final_data = JSON.stringify(json_data);

        $.ajax({
            url:"http://localhost:3000/ViewGuest",
            method: "POST",
            data: final_data,
            contentType:"application/json",
            success: function(data){
    
              var full_name = data.full_name;
              var guest_id = data.guest_id;
              var  package = data. package;
              var guest_status = data.guest_status;
              var check_in_datetime = new Date(Number(data.check_in_datetime));
              var check_out_datetime = new Date(Number(data.check_out_datetime));
              var length_stay = data.length_stay;
              var transaction_id2 = data.transaction_id2;
              var current_stay = data.current_stay;
              var current_bill = data.current_bill;
              var package_name = data.package_name;
    
              console.log(full_name);

              $.ajax({
                url: '/modal-view-details',
                method: 'GET',
                success: function(data3){
                    $('#modal-handler').css('display', 'flex');
                    $('#modal-handler').html(data3);
                    $('#transaction_id2').html(transaction_id2);
                    $("#full_name").html(full_name);
                    $("#guest_id").html(guest_id);
                    $("#package").html(package_name);
                    $("#guest_status").html(guest_status);
                    $("#check_in_datetime").html(check_in_datetime);
                    $("#check_out_datetime").html(check_out_datetime);
                    $("#length_stay").html(length_stay);
                    $("#guest_status").html(guest_status);
                    $("#package_selected").val(package);
                    $("#transaction_id3").val(transaction_id2);
                    $("#package_name_val").val(package_name);
                    $("#guest_status_2").val(guest_status);

                   
                    
                },
                error: function(err){
                    console.error(err);
                }
            });
    
        
    
            },
            error:function(xhr){
              
            }
    
          });
        


        
    });


});


