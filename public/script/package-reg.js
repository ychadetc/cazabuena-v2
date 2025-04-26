
$(document).ready(function(){

    
    $(document).on('click', '#btnSubmitPackage', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        
        let multiple_rooms = [];

        // Collect all data-roomID values
        $("#selected-rooms p").each(function(){
            multiple_rooms.push($(this).attr("data-roomID").replace(/([a-zA-Z])([0-9])/g, '$1 $2'));
        });

        // Check if no rooms are selected
        if (multiple_rooms.length === 0) {
            alert("Select a room");
            return;
        }



        //________INSERT FUNCTION_____________________



        var package_code = Math.floor(Math.random()*90000) + 10000;

        var data_json_rooms = []

        for(var multiple_rooms_len = 0; multiple_rooms_len<multiple_rooms.length; multiple_rooms_len++){

           

            console.log(multiple_rooms[multiple_rooms_len])

            var packageData = {
                           "package_name":$("#txtPackageName").val(), 
                           "no_of_person":$("#txtNoPax").val(), 
                           "room_id":multiple_rooms[multiple_rooms_len], 
                           "location":$("#txtPackageLocation").val(), 
                           "no_of_rooms":$("#txtNoRooms").val(), 
                           "package_rate":$("#txtPackageRate").val(), 
                           "accom_type":$("#txtAccomodation").val(),
                           "package_code":package_code,
                           "package_status":$("#txtVillaStatus").val()
                          };
        
             var JsonPackageData = JSON.stringify(packageData);


             console.log(JsonPackageData)

             $.ajax({
                          url:"http://localhost:3000/InsertPackage",
                          type:"POST",
                          data:JsonPackageData,
                          contentType:'application/json',
                          success: function(data){
                              // Proceed with modal handling
                                $('#modal-handler .modal-add-package').hide();
                                $('#modal-handler .modal-success-package').css('display', 'flex');

                                setTimeout(function() {
                                    $('#modal-handler .modal-success-package').fadeOut();
                                    $('#modal-handler').fadeOut();
                                }, 2000);
                          },
                          
                          error: function(xhr, status, error){
                              alert(error);
                          }

                      });


        }

        //________INSERT FUNCTION_____________________

       

       
    });

    $("#tag-container").hide(); 

    if ($("#txtRoomID option[value='']").length === 0) {
        $("#txtRoomID").prepend(`<option value="" disabled selected hidden>Select a Room</option>`);
    }

    
    
    
    
    
    // Handle selection change
    $(document).on("change", "#txtRoomID", function () {
        let selectedRoom = $(this).val(); 
        console.log(selectedRoom);
        let selectedText = $("#txtRoomID option:selected").text();

        if (selectedRoom) {
            if ($("#selected-rooms p").length === 0) {
                $("#tag-container").css("display", "flex").hide().fadeIn("fast");
            }

            $("#selected-rooms").append(
                `<p data-roomID="${selectedRoom}">${selectedText} <i class="fas fa-times remove-room"></i></p>`
            );

            $("#txtRoomID option[value='" + selectedRoom + "']").remove();
            $("#txtRoomID").val("");
        }
    });

    
    
    
    
    
    
    $(document).on("click", ".remove-room", function () {
        let $parent = $(this).parent();
        let roomID = $parent.attr("data-roomID");
        let roomText = $parent.contents().get(0).nodeValue.trim(); 

        $("#txtRoomID").append(`<option value="${roomID}">${roomText}</option>`);
        $parent.remove();

        if ($("#selected-rooms p").length === 0) {
            $("#tag-container").fadeOut("fast");
        }
    });

    

 
});
