$(document).ready(function(){
    $(document).on('click', '#btnSubmitPackage', function(){
        $('#modal-handler .modal-add-package').hide();
        $('#modal-handler .modal-success-package').css('display', 'flex');
    
        setTimeout(function() {
            $('#modal-handler .modal-success-package').fadeOut();
            $('#modal-handler').fadeOut();
        }, 2000);
    });    
});