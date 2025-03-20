$(document).ready(function(){

    //___________________________________________________________SIDEBAR START____________________________________________________
    $(document).on('click', '#btnOpenHome', function(){
        window.location.href = '/';
    });


    $(document).on('click', '#btnOpenGuestRegistration', function(){
        $.ajax({
            url: '/guest-register',
            method: 'GET',
            success: function(data) {
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').html(data); 
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
                $('#content-contain').html(data); 
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
                $('#content-contain').html(data); 
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
                $('#content-contain').html(data); 
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
                $('#content-contain').html(data); 
            },
            error: function(err){
                console.error(err);
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
                $('#modal-handler').html(data); 
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
                $('#modal-handler').html(data);
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
                $('#modal-handler').html(data);
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
                $('#modal-handler').html(data);
            },
            error: function(err){
                console.error(err);
            }
        });
    });


});