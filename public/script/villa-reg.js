$(document).ready(function () {
    updateStatusColors(); 
    setInterval(updateStatusColors, 10); 

    $(document).on('click', '#btnSubmitVilla', function(e){

        e.preventDefault();
        e.stopImmediatePropagation();

        var villaData = {"villa_name":$("#txtVillaName").val(), 
                         "villa_status":$("#txtVillaStatus").val(),
                         "color_code":$("#txtVillaColor").val()
                         
                         };
        var JsonVillaData = JSON.stringify(villaData);

        $.ajax({
                    url:"http://localhost:3000/InsertVilla",
                    type:"POST",
                    data:JsonVillaData,
                    contentType:'application/json',
                    success: function(data){
                        $('#modal-handler .modal-add-villa').hide();
                        $('#modal-handler .modal-success-villa').css('display', 'flex');
                    
                        setTimeout(function() {
                            $('#modal-handler .modal-success-villa').fadeOut();
                            $('#modal-handler').fadeOut();
                        }, 2000);
                    },
                    
                    error: function(xhr, status, error){
                        alert(error);
                    }

                })
      
    });


    $(document).on('click', "#DeleteVilla", function(e){

                               
        e.preventDefault();
        e.stopImmediatePropagation();

        //const confirmation = confirm("Are you sure you want to delete this item?");

        if (confirm("delete this?")== true) {

                const villa_id = $(this).val();

                //alert(villa_id);

                const villaIDData ={"villa_id":villa_id} 

                const villaIDJson = JSON.stringify(villaIDData);

                $.ajax({
                    url:"http://localhost:3000/deleteVilla",
                    type:"POST",
                    data:villaIDJson,
                    contentType:'application/json',
                    success: function(data){

                        alert(data.message);

                    },

                    error:function(xhr, status, error){
                        alert(error);
                    }

               });
            }

            else {
                    // User clicked "Cancel" or closed the dialog
                    alert("Deletion cancelled.");
                }

                      


    });


  


   
    
    
});




















function updateStatusColors() {
    $(".status-data").each(function () {
        let status = $(this).text().trim(); 
        let indicator = $(this).find(".stat-indicator"); 

        // Check status and apply color
        if (status.includes("Available")) {
            indicator.css("background-color", "green");
        } else if (status.includes("Occupied")) {
            indicator.css("background-color", "red");
        }
    });
}