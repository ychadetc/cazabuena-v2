$(document).ready(function (){
   
    $(document).on('click', '#btnCloseModal', function(){
        $('#modal-handler').hide();
    });

    $(document).on('click', '#btnSubmitGuest', function(){
        $('#modal-handler .modal-guest-reg').hide();
        $('#modal-handler .modal-confirm-guest').css('display', 'flex');

       
        let inputText = $('#txtFullName').val().trim();
        let guestName = inputText.split(/\s+/)[0] || "guest";

        $('#p-guestName').text("Do you want to register " + (guestName || "this guest") + "?");
    });

    $(document).on('click', '#btnCancelGuest', function(){
        $('#modal-handler .modal-guest-reg').css('display', 'flex');
        $('#modal-handler .modal-confirm-guest').hide();
    });

    $(document).on('click', '#btnYesGuest', function(){
        $('#modal-handler .modal-confirm-guest').hide();
        $('#modal-handler .modal-success-guest').css('display', 'flex');
    
        setTimeout(function() {
            $('#modal-handler .modal-success-guest').fadeOut();
            $('#modal-handler').fadeOut();
        }, 2000);
        
    });
    



});