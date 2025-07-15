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

    $(document).on('click', '#btnYesBillingChanges', function(e){

        e.preventDefault();
        e.stopImmediatePropagation();
        
      

        /* 
            Ganito nalang yung ajax, use switch case statement
            switch (modshifter)
            case 1 then /submit-add-ons
        */
            switch (modShifter){
                case 1:
                        const addons_data = {
                                "addons_remarks":$("#addons_remarks").val(),
                                "addons_amount":$("#addons_amount").val(),
                                "addons_description":$("#addons_description").val(),
                                "transaction_id2":$("#transaction_text").val()
                        }
                    
                        var jsonAddons = JSON.stringify(addons_data);
                    
                        $.ajax({
                            url:"http://localhost:3000/addons",
                            type:"POST",
                            data:jsonAddons,
                            contentType:'application/json',
                            success:function(data){

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
                    
                            },
                            error:function(xhr, err){
                                alert(err)
                            }
                    
                            })
                    // ditp yung ajax for add-ons
                   /* $.ajax({
                        url: '/add-ons',
                        method: 'POST',
                        data: '',
                        success: function(){
                            //dito lalagay yung when then when then sa taas
                        }
                    });*/
                    break;
                case 2:
                    // ditp yung ajax for discount
                    
                    const discount_data = {

                        "discount_type":$("#discount_type").val(),
                        "discount_remarks":$("#discount_remarks").val(),
                        "transaction_id2":$("#transaction_number").val()

                    }

                    const jsonDiscount = JSON.stringify(discount_data);
                    
                    $.ajax({
                        url: 'http://localhost:3000/discount',
                        method: 'POST',
                        data: jsonDiscount,
                        contentType:'application/json',
                        success: function(data){
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
                        },

                        error:function(xhr, err){
                                alert(err)
                            }
                    });
                    break;
                case 3:


                            const adjustment_amount = $("#adjustment_amount").val();
                            const adjustment_type = $("#adjustment_type").val();
                            const adjustment_remarks = $("#adjustment_remarks").val();
                            const transaction_text = $("#transaction_text").val();
                        
                            const adjustment_data = {
                                "adjustment_amount":adjustment_amount,
                                "adjustment_type":adjustment_type,
                                "adjustment_remarks":adjustment_remarks,
                                "transaction_text":transaction_text
                            }
                        
                            var jsonAdjustments = JSON.stringify(adjustment_data);
                        
                            $.ajax({
                                url:"http://localhost:3000/UpdateGuestBill",
                                type:"POST",
                                data:jsonAdjustments,
                                contentType:'application/json',
                                success:function(data){

                                                    
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
                        
                                },
                        
                                error:function(xhr, err){
                                    alert(err);
                                }
                        
                            });
                                // ditp yung ajax for adjustment
                            /* $.ajax({
                                    url: '/adjustment',
                                    method: 'POST',
                                    data: '',
                                    success: function(){
                                        //dito lalagay yung when then when then sa taas
                                    }
                                });*/
                                break;
            }

    });



});


$(document).on('click', '.deleteAddons', function () {

  
    const addons_no = $(this).val();
    const addons_no_data = {"addons_no":addons_no};
    const addons_no_json = JSON.stringify(addons_no_data);

    $.ajax({
        url:"http://localhost:3000/deleteAddons",
        type:"POST",
        data:addons_no_json,
        contentType:'application/json',
        success:function(data){

            alert(data.message+" "+"Successfully deleted!")
            
        },

        error:function(xhr, err){

            alert(err);

        }

    })

})


$(document).on('click', '.deleteDiscount', function () {

   
    const discount_no = $(this).val();
    const discount_no_data = {"discount_no":discount_no};
    const discount_no_json = JSON.stringify(discount_no_data);

    $.ajax({
        url:"http://localhost:3000/deleteDiscount",
        type:"POST",
        data:discount_no_json,
        contentType:'application/json',
        success:function(data){

            alert(data.message+" "+"Successfully updated!")
            
        },

        error:function(xhr, err){
            alert(err);

        }

    })

})






$(document).on('click', '.deleteAdjust', function () {

    const adjustment_no = $(this).val();
    const adjustment_no_data = {"adjustment_no":adjustment_no};
    const adjustment_no_json = JSON.stringify(adjustment_no_data);

    $.ajax({
        url:"http://localhost:3000/deleteAdjustment",
        type:"POST",
        data:adjustment_no_json,
        contentType:'application/json',
        success:function(data){

            alert(data.message+" "+"Successfully updated!")
            
        },

        error:function(xhr, err){
            alert(err);

        }

    })

})





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
