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

    $(document).on('click', '#btnYesGuest', function(e){

        e.preventDefault();
        e.stopImmediatePropagation();

        var guestData = {"full_name":$("#txtFullName").val(), 
                         "contact_number":$("#txtContact").val(),
                        "email":$("#txtEmail").val(),
                        "age":$("#txtAge").val()};
        var JsonguestData = JSON.stringify(guestData);

        $.ajax({

                    url:"http://localhost:3000/InsertGuest",
                    type:"POST",
                    data:JsonguestData,
                    contentType:'application/json',
                    success: function(data){
                        $('#modal-handler .modal-confirm-guest').hide();
                        $('#modal-handler .modal-success-guest').css('display', 'flex');
                    
                        setTimeout(function() {
                            $('#modal-handler .modal-success-guest').fadeOut();
                            $('#modal-handler').fadeOut();
                        }, 2000);
                    },
                    
                    error: function(xhr, status, error){
                        alert(error);
                    }

        });

    
        
    });
    

    $(document).on("click", '#DeleteGuest', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        if (confirm("delete this?")== true) {

           const guest_id =  $(this).val();
           const guestIDData = {"guest_id":guest_id};
           const jsonGuestID = JSON.stringify(guestIDData);

           $.ajax({
                    url:"http://localhost:3000/deleteGuest",
                    type:"POST",
                    data:jsonGuestID,
                    contentType:'application/json',
                    success: function(data){

                        alert(data.message);

                    },

                    error:function(xhr, status, error){
                        alert(error);
                    }

               });

        }
        else{
            alert("Deletion cancelled.");
        }

    });



});