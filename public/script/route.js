$(document).ready(function(){

    $(document).on('click', '#btnLogOut', function(){
        $.ajax({
            url: '/logout',
            method: 'GET',
            xhrFields: {
              withCredentials: true // sends cookies
            },
            success: function(response) {
              window.location.href = '/login';
            },
            error: function(err) {
              console.error('Logout failed:', err);
            }
          });
    });

    //___________________________________________________________SIDEBAR START____________________________________________________
    $(document).on('click', '#btnOpenHome', function(){
        window.location.href = '/';
    });

    $(document).on('click', '#btnOpenHomev2', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/home',
            method: 'GET',
            success: function(data) {
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
                $('.villa-border .villa-figure').css({
                    'transform': 'rotate(0deg) translateX(0px) translateY(0px)'
                });
                $('#loading').hide();
            },
            error: function(err) {
                console.error("Error loading modal:", err);
                $('#loading').hide();
            }
        });
    });


    $(document).on('click', '#btnOpenGuestRegistration', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/guest-register',
            method: 'GET',
            success: function(data) {
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100); 
                $('#loading').hide();
            },
            error: function(err) {
                console.error("Error loading modal:", err);
                $('#loading').hide();
            }
        });
        
    });

    $(document).on('click', '#btnOpenVillaRegistration', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/villa-registration',
            method: 'GET',
            success: function(data) {
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
                $('#loading').hide();
            },
            error: function(err) {
                console.error("Error loading modal:", err);
                $('#loading').hide();
            }
        });
    });


    $(document).on('click', '#btnOpenRoomRegistration', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/room-registration',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right'); 
                $('#loading').hide();
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });

    $(document).on('click', '#btnOpenPackageRegistration', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/package-registration',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right'); 
                $('#loading').hide();
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });

    

    $(document).on('click', '#btnOpenReservation', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/reservation-page',
            method: 'GET',
            success: function(data){

                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');

                var events = [];
                var guestList1 = [];

              

                $.ajax({

                    type:"GET",
                    url:"http://localhost:3000/GuestTable",
                    success:function(data1){
            
                    const jsonData = data1.guest;
            
                    $.each(jsonData, function(index, guest) {
                        guestList1.push(guest);
                    });
            
            
                    for (var x = 0; x < guestList1.length; x++) {
            
                        var guest_id = guestList1[x].guest_id;
                        var full_name = guestList1[x].full_name;
                        var check_in_datetime = Number(guestList1[x].check_in_datetime);
                        var check_out_datetime =Number(guestList1[x].check_out_datetime);
                        var length_stay = guestList1[x].length_stay;
                        var guest_status = guestList1[x].guest_status;
                        var transaction_id2 = guestList1[x].transaction_id2;
            
                        var start = new Date(check_in_datetime);
                        var end = new Date(check_out_datetime);

                        console.log(start)
                        console.log(end)


             
            
                        events.push({title:full_name, start:start, end:end})
            
                    }


                    console.log(events)


                    $('#calendar').fullCalendar({
                        selectable: true,
                        selecHelpre: true,
                        events:events,
                        
                        header:{
                            right:'prev, today, next'
                        },
        
                        buttonText:{
                            today: 'TODAY',
                            month: 'MONTH',
                            week: 'WEEK',
                            day: 'DAY',
                            list: 'LIST'
                        }
        
                    });
                
                    $('#loading').hide();
                    },
            
                    error:function(xhr, status, err){
            
                        console.error("Error:", err)
                        $('#loading').hide();
                    }
            
                })


              
                    
            
            },
            
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });


    $(document).on('click', '#btnOpenBilling', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/billing-page',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
                $('#loading').hide();
            },
            error: function(err){
                console.error(err)
                $('#loading').hide();
            }
        });
    });




    $(document).on('click', '#btnOpenReports', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/fetch-reports',
            method: 'GET',
            success: function(data){
                const $container = $('#content-contain');
                $container.removeClass('fade-in-right'); 
                $container.html(data);
                void $container[0].offsetWidth; 
                $container.addClass('fade-in-right');
                $('#loading').hide();
            },
            error: function(err){
                console.error(err)
                $('#loading').hide();
            }
        });
    });



    

//________________________________________________SIDEBAR END________________________________________________________________________________











    //________________________________MODALS____________________________________
    
    $(document).on('click', '#btnOpenAddVilla', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/modal-add-villa',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
                $('#loading').hide();
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });

    $(document).on('click', '#btnOpenAddRoom', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/modal-add-room',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
                $('#loading').hide();
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });

    $(document).on('click','#btnOpenAddpackage', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/modal-add-package',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
                $('#loading').hide();
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });

    $(document).on('click','#btnAddBooking', function(){
        $('#loading').css('display', 'flex');
        $.ajax({
            url: '/modal-add-booking',
            method: 'GET',
            success: function(data){
                $('#modal-handler').css('display', 'flex');
                $('#modal-handler').hide().html(data).fadeIn(100);
                $('#loading').hide()
            },
            error: function(err){
                console.error(err);
                $('#loading').hide();
            }
        });
    });
   


    $(document).on('click', '#t-b-billing tr td .btnOpenBillingModal', function () {

        var transaction_id2 = $(this).val();
        console.log(transaction_id2)
        var rawData = {"transaction_id2":transaction_id2}
        console.log(rawData);
        const transactionIdJSON = JSON.stringify(rawData);
        $('#loading').css('display', 'flex');

           //____________________________LOAD MODAL__________________________________

                $.ajax({
                        url: '/modal-billing',
                        method: 'GET',
                        success: function(data){
                            $('#modal-handler').css('display', 'flex');
                            $('#modal-handler').hide().html(data).fadeIn(100);
                            $("#transaction_text").val(transaction_id2);
                            $("#transaction_number").val(transaction_id2);
                            $('#loading').hide();
                        },
                        error: function(){
                            console.error(err);
                            $('#loading').hide();
                        }
                    });
                 //____________________________LOAD MODAL__________________________________


$(document).ready(function() {

    //____________________________FOR LOADING ADDONS___________________________________


         
        $.ajax({
            url:"http://localhost:3000/viewAddons",
            type: "POST",
            data: transactionIdJSON,
            contentType:"application/json",
            success:function(data2){

             
               
                
                
                const transactions = [];
                
                const jsonData = data2.addons;
                
                $.each(jsonData, function(index, tr) {
                        transactions.push(tr);
                    });


                for (var x = 0; x < transactions.length; x++) {
                    
                    const addons_description = transactions[x].addons_description;
                    const addons_amount = transactions[x].addons_amount;
                    const addons_remarks = transactions[x].addons_remarks;
                    const time_encoding = transactions[x].time_encoding;
                    const addons_no = transactions[x].addons_no;

                    console.log(addons_amount)

                    const addOnsData = `
                            <tr>
                                <td>${addons_description}</td>
                                <td>${addons_amount}</td>
                                <td>${addons_remarks}</td>
                                <td>${time_encoding}</td>
                                <td><button class="deleteAddons" value=${addons_no}>Delete</button></td>
                            </tr>
                         `;

                    $('#addonsBody').append(addOnsData);
                    
                    
                }

            },
            error:function(xhr, status, error){
                alert(error)
            }



            
        })


        //____________________________FOR LOADING ADDONS___________________________________



        //__________________________FOR LOADING TABLE OF DISCOUNT_____________________________



        $.ajax({
            url:"http://localhost:3000/viewDiscount",
            type: "POST",
            data: transactionIdJSON,
            contentType:"application/json",
            success:function(data3){

             
               
                
                
                const transactions = [];
                
                const jsonData = data3.discounts;
                
                $.each(jsonData, function(index, tr) {
                        transactions.push(tr);
                    });


                for (var x = 0; x < transactions.length; x++) {
                    
                    const discount_type = transactions[x].discount_type;
                    const discount_amount = transactions[x].discount_amount;
                    const transaction_id2 = transactions[x].transaction_id2;
                    const time_encoding = transactions[x].time_encoding;
                    const discount_no = transactions[x].discount_no;

                    console.log(addons_amount)

                    const discountData = `
                            <tr>
                                <td>${discount_type}</td>
                                <td>${discount_amount}</td>
                                <td>${transaction_id2}</td>
                                <td>${time_encoding}</td>
                                <td><button class = "deleteDiscount" value="${discount_no}">Delete</td>
                            </tr>
                         `;

                    $('#discountBody').append(discountData);
                    
                    
                }

            },
            error:function(xhr, status, error){
                alert(error)
            }



            
        })


        


        //__________________________FOR LOADING TABLE OF DISCOUNT_____________________________




        //__________________________FOR LOADING TABLE OF ADJUSTMENT__________________________



          $.ajax({
            url:"http://localhost:3000/viewAdjustment",
            type: "POST",
            data: transactionIdJSON,
            contentType:"application/json",
            success:function(data3){

             
               
                
                
                const transactions = [];
                
                const jsonData = data3.adjustments;
                
                $.each(jsonData, function(index, tr) {
                        transactions.push(tr);
                    });


                for (var x = 0; x < transactions.length; x++) {
                    
                    const transaction_id = transactions[x].transaction_id;
                    const adjustment_type = transactions[x].adjustment_type;
                    const adjustment_amount = transactions[x].adjustment_amount;
                    const adjustment_remarks = transactions[x].adjustment_remarks;
                    const adjustment_no = transactions[x].adjustment_no;

                    console.log(addons_amount)

                    const adjustmentData = `
                            <tr>
                                <td>${transaction_id}</td>
                                <td>${adjustment_type}</td>
                                <td>${adjustment_amount}</td>
                                <td>${adjustment_remarks}</td>
                                <td><button class = "deleteAdjust" value="${adjustment_no}">Delete</button></td>
                            </tr>
                         `;

                    $('#adjustmentBody').append(adjustmentData);
                    
                    
                }

            },
            error:function(xhr, status, error){
                alert(error)
            }



            
        })


 });


        //__________________________FOR LOADING TABLE OF ADJUSTMENT__________________________
    });
    


});