$(document).ready(function(){


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




});