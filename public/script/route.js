$(document).ready(function(){

    $(document).on('click', '#btnLogOut', function(){
        $.ajax({
            url: '/logout',
            method: 'GET',
            xhrFields: {
              withCredentials: true // sends cookies
            },
            success: function(response) {
              window.location.href = '/login';
            },
            error: function(err) {
              console.error('Logout failed:', err);
            }
          });
    });

    //___________________________________________________________SIDEBAR START____________________________________________________
    $(document).on('click', '#btnOpenHome', function(){
        window.location.href = '/';
    });

    $(document).on('click', '#btnOpenHomev2', function(){
        $.ajax({
            url: '/home',
            method: 'GET',
            success: function(data) {
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
                $('.villa-border .villa-figure').css({
                    'transform': 'rotate(0deg) translateX(0px) translateY(0px)'
                });
            },
            error: function(err) {
                console.error("Error loading modal:", err);
            }
        });
    });


    $(document).on('click', '#btnOpenGuestRegistration', function(){
        $.ajax({
            url: '/guest-register',
            method: 'GET',
            success: function(data) {
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100); 
                
            },
            error: function(err) {
                console.error("Error loading modal:", err);
            }
        });
        
    });

    $(document).on('click', '#btnOpenVillaRegistration', function(){
        $.ajax({
            url: '/villa-registration',
            method: 'GET',
            success: function(data) {
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
            },
            error: function(err) {
                console.error("Error loading modal:", err);
            }
        });
    });


    $(document).on('click', '#btnOpenRoomRegistration', function(){
        $.ajax({
            url: '/room-registration',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right'); 
            },
            error: function(err){
                console.error(err);
            }
        });
    });

    $(document).on('click', '#btnOpenPackageRegistration', function(){
        $.ajax({
            url: '/package-registration',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right'); 
            },
            error: function(err){
                console.error(err);
            }
        });
    });

    

    $(document).on('click', '#btnOpenReservation', function(){
        $.ajax({
            url: '/reservation-page',
            method: 'GET',
            success: function(data){

                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');

                var events = [];
                var guestList1 = [];

              

                $.ajax({

                    type:"GET",
                    url:"http://localhost:3000/GuestTable",
                    success:function(data1){
            
                    const jsonData = data1.guest;
            
                    $.each(jsonData, function(index, guest) {
                        guestList1.push(guest);
                    });
            
            
                    for (var x = 0; x < guestList1.length; x++) {
            
                        var guest_id = guestList1[x].guest_id;
                        var full_name = guestList1[x].full_name;
                        var check_in_datetime = Number(guestList1[x].check_in_datetime);
                        var check_out_datetime =Number(guestList1[x].check_out_datetime);
                        var length_stay = guestList1[x].length_stay;
                        var guest_status = guestList1[x].guest_status;
                        var transaction_id2 = guestList1[x].transaction_id2;
            
                        var start = new Date(check_in_datetime);
                        var end = new Date(check_out_datetime);

                        console.log(start)
                        console.log(end)


             
            
                        events.push({title:full_name, start:start, end:end})
            
                    }


                    console.log(events)


                    $('#calendar').fullCalendar({
                        selectable: true,
                        selecHelpre: true,
                        events:events,
                        
                        header:{
                            right:'prev, today, next'
                        },
        
                        buttonText:{
                            today: 'TODAY',
                            month: 'MONTH',
                            week: 'WEEK',
                            day: 'DAY',
                            list: 'LIST'
                        }
        
                    });
                
            
                    },
            
                    error:function(xhr, status, err){
            
                        console.error("Error:", err)
            
                    }
            
                })


              
                    
            
            },
            
            error: function(err){
                console.error(err);
            }
        });
    });


    $(document).on('click', '#btnOpenBilling', function(){
        $.ajax({
            url: '/billing-page',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
            },
            error: function(err){
                console.error(err)
            }
        });
    });



    

//________________________________________________SIDEBAR END________________________________________________________________________________











    //________________________________MODALS____________________________________
    
    $(document).on('click', '#btnOpenAddVilla', function(){
        $.ajax({
            url: '/modal-add-villa',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);

            },
            error: function(err){
                console.error(err);
            }
        });
    });

    $(document).on('click', '#btnOpenAddRoom', function(){
        $.ajax({
            url: '/modal-add-room',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
            },
            error: function(err){
                console.error(err);
            }
        });
    });

    $(document).on('click','#btnOpenAddpackage', function(){
        $.ajax({
            url: '/modal-add-package',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
            },
            error: function(err){
                console.error(err);
            }
        });
    });

    $(document).on('click','#btnAddBooking', function(){
        $.ajax({
            url: '/modal-add-booking',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
            },
            error: function(err){
                console.error(err);
            }
        });
    });
   


    $(document).on('click', '#t-b-billing tr td .btnOpenBillingModal', function () {

        var transaction_id2 = $(this).val();
        $.ajax({
            url: '/modal-billing',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
                $("#transaction_text").val(transaction_id2);
               
            },
            error: function(){
                console.error(err);
            }
        });
    });
    


});