$(document).ready(function(){
    $(document).on('click', '#btnSubmitRoom', function(e){
        
        e.preventDefault();
        e.stopImmediatePropagation();

        var roomData = {"room_name":$("#txtRoomName").val(), 
                         "location":$("#txtRoomLocation").val(), 
                         "room_status":$("#txtRoomStatus").val(), 
                         "villa_id":$("#txtVillaID").val()
                        }
        var JsonRoomData = JSON.stringify(roomData);

        
        $.ajax({
                    url:"http://localhost:3000/InsertRoom",
                    type:"POST",
                    data:JsonRoomData,
                    contentType:'application/json',
                    success: function(data){
                        $('#modal-handler .modal-add-room').hide();
                        $('#modal-handler .modal-success-room').css('display', 'flex');
                    
                        setTimeout(function() {
                            $('#modal-handler .modal-success-room').fadeOut();
                            $('#modal-handler').fadeOut();
                        }, 2000);
                      
                    },
                    
                    error: function(xhr, status, error){
                        alert(error);
                    }

                })
      
    });    
});