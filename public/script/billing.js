$(document).ready(function () {

    let controller = 1;
    let modShifter = 1;
 
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
    
        modShifter = 1;   
        messshifter(modShifter); 
    });

    $(document).on('click', '#btnSubmitDiscount', function(){
    
        modShifter = 2;   
        messshifter(modShifter); 
    });

    $(document).on('click', '#btnSubmitAdjustment', function(){
    
        modShifter = 3;   
        messshifter(modShifter); 
    });


    $(document).on('click', '#btnCancelBillingChanges', function(){
        $.when(
            $('.modal-confirm-billing-changes').fadeOut(100)
        ).then(function(){
            $('.btncontroller').fadeIn(100),
            $('.modal-billing-container').fadeIn(100)
        });
    });

    $(document).on('click', '#btnYesBillingChanges', function(){
        
        // _______________Palagay sa success ajax__________________
        $.when(
            $('.modal-confirm-billing-changes').fadeOut(100)
        ).then(function(){
            $('.modal-success-billing-changes').css('display', 'flex').hide();
        $('.modal-success-billing-changes #billing-success-message').text(modShifter === 1 ? 'Added successfully!' : modShifter === 2 ? 'Discount submitted successfully' : 'Adjustment saved successfully')
            $('.modal-success-billing-changes').fadeIn(100)
            setTimeout(function(){
                $('.modal-success-billing-changes').fadeOut();
            }, 2000)
            
        });

        $.when(
            setTimeout(function(){
                $('.modal-success-billing-changes').fadeOut();
            }, 2000)
        ).then(function(){
           setTimeout(function(){
                $('.btncontroller').fadeIn(100)
                $('.modal-billing-container').fadeIn(100)
           }, 2500);
        })
        // _______________Palagay sa success ajax END________________

        /* 
            Ganito nalang yung ajax, use switch case statement
            switch (modshifter)
            case 1 then /submit-add-ons
        */
            switch (modShifter){
                case 1:
                    // ditp yung ajax for add-ons
                    $.ajax({
                        url: '/add-ons',
                        method: 'POST',
                        data: '',
                        success: function(){
                            //dito lalagay yung when then when then sa taas
                        }
                    });
                    break;
                case 2:
                    // ditp yung ajax for discount
                    $.ajax({
                        url: '/discount',
                        method: 'POST',
                        data: '',
                        success: function(){
                            //dito lalagay yung when then when then sa taas
                        }
                    });
                    break;
                case 3:
                    // ditp yung ajax for adjustment
                    $.ajax({
                        url: '/adjustment',
                        method: 'POST',
                        data: '',
                        success: function(){
                            //dito lalagay yung when then when then sa taas
                        }
                    });
                    break;
            }

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

function messshifter(shiftval){
    $.when(
        $('.btncontroller').fadeOut(100),
        $('.modal-billing-container').fadeOut(100)
    ).then(function() {
        $('.modal-confirm-billing-changes')
            .css('display', 'flex')
            .hide()
            .fadeIn(100);
    });
    
    switch (shiftval){
        case 1:
            $('.modal-confirm-billing-changes #billing-message').text('Do you want to confirm add ons?');
            break;
        case 2:
            $('.modal-confirm-billing-changes #billing-message').text('Do you want to confirm discount?');
            break;
        case 3:
            $('.modal-confirm-billing-changes #billing-message').text('Do you want to confirm adjustments?')
            break;
    }
    

}
