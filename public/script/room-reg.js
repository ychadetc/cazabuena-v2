$(document).ready(function(){
    $(document).on('click', '#btnSubmitRoom', function(){
        $('#modal-handler .modal-add-room').hide();
        $('#modal-handler .modal-success-room').css('display', 'flex');
    
        setTimeout(function() {
            $('#modal-handler .modal-success-room').fadeOut();
            $('#modal-handler').fadeOut();
        }, 2000);
    });    
});