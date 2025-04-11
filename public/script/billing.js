$(document).ready(function () {

    let controller = 1;

 
    $(document).on('click', '#btnCloseModal', function(){
        controller = 1;
    });
  
    $(document).on('click', '#btnPrevBillingPhase', function () {
        if (controller > 1) {
            controller = controller - 1;
        }
   
        phase(controller);
    });


    $(document).on('click', '#btnNextBillingPhase', function () {
        if (controller < 4) {
            controller = controller + 1;
        }
    
        phase(controller);
    });

    $(document).on('click', '#btnSubmitAddOns', function(){

    });

});


function phase(controller) {
    switch (controller) {
        case 1:
            $('#modal-handler .modal-billing-container .billing-details').css('width', '100%');
            $('#modal-handler .modal-billing-container .billing-add-ons').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-discounts').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-adjustment').css('width', '0%');
            $('#billing-modal-title').text('Details')
            break;
        case 2:
            $('#modal-handler .modal-billing-container .billing-details').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-add-ons').css('width', '100%');
            $('#modal-handler .modal-billing-container .billing-discounts').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-adjustment').css('width', '0%');
            $('#billing-modal-title').text('Add Ons')
            break;
        case 3:
            $('#modal-handler .modal-billing-container .billing-details').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-add-ons').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-discounts').css('width', '100%');
            $('#modal-handler .modal-billing-container .billing-adjustment').css('width', '0%');
            $('#billing-modal-title').text('Discounts')
            break;
        case 4:
            $('#modal-handler .modal-billing-container .billing-details').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-add-ons').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-discounts').css('width', '0%');
            $('#modal-handler .modal-billing-container .billing-adjustment').css('width', '100%');
            $('#billing-modal-title').text('Adjustment')
            break;
    }
}
