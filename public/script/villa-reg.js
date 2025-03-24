$(document).ready(function () {
    updateStatusColors(); 
    setInterval(updateStatusColors, 10); 

    $(document).on('click', '#btnSubmitVilla', function(){
        $('#modal-handler .modal-add-villa').hide();
        $('#modal-handler .modal-success-villa').css('display', 'flex');
    
        setTimeout(function() {
            $('#modal-handler .modal-success-villa').fadeOut();
            $('#modal-handler').fadeOut();
        }, 2000);
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