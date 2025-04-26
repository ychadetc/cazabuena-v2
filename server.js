const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mysql = require('mysql');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cazabuena',
  port: 3306
})

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session({
  store: new FileStore({ path: '../sessions', logFn: function() {} }), 
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {

      if (req.session.user) {
        // res.send({ validation: "session", user: req.session.user });
    
          res.render('layout',{
            title: "Home",
            content: 'home.ejs'
        });
      } 
      
      else {
          //res.send({ validation: "no_session" });
          res.render('login-page.ejs')
    
        //res.render('login-page.ejs');
      }
  
  });

  app.get('/home', (req, res)=>{ /* for new homepage/dashboard | singit muna*/
    res.render('homeV2.ejs');
  });

app.get('/login', (req, res)=>{
  res.render('login-page.ejs');
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/login'); 
  });
});

app.get('/guest-register', (req, res) =>{
    res.render('modal-guest-reg.ejs');
});
  
app.get('/villa-registration', (req, res)=>{
    res.render('villa-registration.ejs');
})


app.get('/modal-add-villa', (req, res)=>{
  res.render('modal-add-villa.ejs');
});

app.get('/modal-billing', (req, res)=>{
  res.render('modal-billing.ejs');
});

app.get('/room-registration', (req, res)=>{
res.render('room-registration.ejs');
});

app.get('/billing-page', (req, res)=>{
  res.render('billing.ejs');
});

app.get('/modal-add-room', (req, res)=>{
res.render('modal-add-room.ejs');
});


app.get('/package-registration', (reg, res) =>{
  res.render('package-registration.ejs')
});

app.get('/modal-add-package', (req, res) =>{
  res.render('modal-add-package.ejs');
});

app.get('/reservation-page', (req, res) =>{
  res.render('reservation.ejs')
});

app.get('/modal-add-booking', (req, res) =>{
  res.render('modal-add-booking.ejs')
});

app.get('/modal-view-details', (req, res) =>{
  res.render('modal-view-details.ejs')
});

app.get('/test', (req, res) =>{

});




app.get("/checkSession", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Config:", req.session);
  console.log("Stored Session User:", req.session.user);

  if (req.session.user) {
   res.send({ validation: "session", user: req.session.user });

      /*res.render('layout',{
        title: "Home",
        content: 'home.ejs'
    });*/
  } 
  
  else {
      res.send({ validation: "no_session" });

    //res.render('login-page.ejs');
  }
});


app.post("/InsertGuest", (req, res)=>{

  var full_name = req.body.full_name;
  var contact_number = req.body.contact_number;
  var email = req.body.email;
  var age = req.body.age;
  var guest_id = Math.floor(Math.random()*90000) + 10000;

  var sql_insert = `
      insert into personal_details_table (full_name, contact_number, email, age, guest_id)
      values (?, ?, ?, ?, ?)
      `;

      connection.query(sql_insert, [full_name, contact_number, email, age, guest_id], (err, rows, fields) => {
      if (err) {
          console.error(err);
          res.status(500).send({ message: 'Failed to create personal details' });
      } else {
          console.log('Personal details inserted successfully!');
          res.send({ message: "Personal details inserted successfully" });
      }
      });

});



app.post("/InsertVilla",(req, res)=>{
  var villa_name = req.body.villa_name;
  var villa_status = req.body.villa_status;
  var color_code = req.body.color_code;

  var sql_insert = `insert into villas (villa_name, villa_status, color_code) values(?,?,?)`;

  connection.query(sql_insert,[villa_name, villa_status, color_code],(err, rows, fields)=>{

      res.send({message:"Villa inserted successfully"});

  });

});

app.post("/InsertRoom",(req,res)=>{

  var room_name = req.body.room_name;
  var room_status = req.body.room_status;
  var location = req.body.location;
  var villa_id = req.body.villa_id;

  var sql_insert = `insert into rooms (room_name, room_status, location, villa_id) values(?,?,?,?)`;

    connection.query(sql_insert,[room_name, room_status, location, villa_id],(err, rows, fields)=>{
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: 'Failed to create room' });
                } else {
                    console.log('Room inserted successfully!');
                    res.send({message:"Room inserted successfully"});
                }
    });

});


app.get('/villas', (req, res) => {
  var query = 'SELECT * FROM villas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({villa:results});
  });
});

app.get('/rooms', (req, res) => {
  var query = 'SELECT * FROM rooms';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({rooms:results});
  });
});


app.get("/roomListPlot", (req, res)=>{

  var sql_view_plot = `select villas.villa_name, rooms.room_name, rooms.villa_id, rooms.room_status
   from rooms inner join villas on villas.villa_name = rooms.villa_id`;

  connection.query(sql_view_plot, (err, rows_plot)=>{

    res.send({toplotRoom:rows_plot});

  });

});


app.get('/rooms', (req, res) => {
  var query = 'SELECT * FROM rooms';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({rooms:results});
  });
});


app.get("/roomList", (req, res)=>{

  var query = `select * from rooms`;

  connection.query(query,(err, results)=>{

    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({room:results});

  });



});








app.get("/GuestOption", (req, res)=>{
    
  var query = 'SELECT * FROM personal_details_table';

  connection.query(query,(err, results)=>{

    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({guest:results});

  });

});


app.get('/packages', (req, res) => {
  var query = 'SELECT * FROM packages where package_status = ?';
  connection.query(query, ["active"],(err, results) => {
    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({package:results});
  });
});


app.get("/GuestTable", (req, res)=>{
    
  var query = `SELECT * FROM guest_table`;

  connection.query(query,(err, results)=>{

    if (err) {
      console.error('error running query:', err);
      return;
    }
    res.send({guest:results});

  });

});

app.get('/checkedOut', (req, res)=>{

  var query = `SELECT * FROM guest_table where guest_status = ?`;

  connection.query(query,["CHECKED_OUT"],(err, results)=>{

    if (err) {
      console.error('error running query:', err);
      return;
    }
      res.send({guesttoBill:results});

  });

});




app.post("/InsertPackage", (req, res)=>{

  //var stringed_combination_form = JSON.parse(combinedJson["parseForm"]);
  
  var package_name = req.body.package_name;
  var no_of_person = req.body.no_of_person;
  var room_id = req.body.room_id;
  var location = req.body.location;
  var no_of_rooms = req.body.no_of_rooms;
  var package_code = req.body.package_code;
  var package_rate = req.body.package_rate;
  var package_status = req.body.package_status;
  var accom_type = req.body.accom_type;

  console.log([package_code,package_name,no_of_person,room_id,location,no_of_rooms,package_rate, package_status, accom_type])
  
  
  console.log(room_id);
  
  var sql_insert = `
    insert into packages (package_code2, package_name, no_of_person, room_id, location, no_of_rooms, package_rate, package_status, accom_type)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
     connection.query(sql_insert,[package_code,package_name,no_of_person,room_id,location,no_of_rooms,package_rate, package_status, accom_type],(err, rows, fields)=>{
          if (err) {
              console.error(err);
              res.status(500).send({ message: 'Failed to create package' });
          } else {
              console.log('Package inserted successfully!');
              res.send({message:"Package inserted successfully"});
          }
     });
  
  });


  app.post("/InsertBooking", (req, res)=>{

    var guest_id = req.body.guest_id;
    var no_pax = req.body.no_pax;
    var package= req.body.package;
    var special_request = req.body.special_request;
    var bookingType = req.body.bookingType;
    var guest_status = bookingType;
    var check_in_datetime = Date.parse(req.body.check_in_datetime);
    var check_out_datetime = Date.parse(req.body.check_out_datetime);
    var rate_no = req.body.rate_no;
    console.log(bookingType);
   
    //________________________GET THE NEW BILL__________________________________

    var selectRateType  = `select * from rate_type where rate_no=?`;

    connection.query(selectRateType, [rate_no], (err, rows15)=>{

      var rate_percent = rows15[0].rate_percent;

      var selectPackagePrice = `select package_rate from packages where package_code = ?`;

      connection.query(selectPackagePrice, [package], (err, rows16)=>{

        var packagePrice = rows16[0].package_rate;
        

        console.log(packagePrice);

        if(rate_no === 3){
          var newCurrentBill = packagePrice
          console.log("Rate is regular")
        }

        else{


          var percentNewCurrentBill = packagePrice * rate_percent;
          var newCurrentBill = percentNewCurrentBill + packagePrice;
  
          console.log("This is new CurrentBill")
  
          console.log(rate_percent);
  
          console.log(newCurrentBill)

        }

        //___________________________PUT CONDITION HERE_______________________________


        //___________________________PUT CONDITION HERE_______________________________

      

                      //____________________________INSERt GUEST into guest table__________________________________

                  var sql_select_guest = `select full_name from personal_details_table where guest_id = ?`;

                  connection.query(sql_select_guest, [guest_id], (err, result)=>{
              
                        var full_name = result[0].full_name;
              
              
                        var sql_insert_book = `INSERT INTO guest_table (guest_id, check_in_datetime, check_out_datetime,
                        no_pax, package, special_request, length_stay, guest_status, full_name, current_bill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                          connection.query(sql_insert_book, [guest_id, check_in_datetime, check_out_datetime,
                            no_pax, package, special_request, length_stay, guest_status, full_name, newCurrentBill], (err, results) => {
                              if (err) {
                                  console.error(err);
                                  res.status(500).send('Error inserting data');
                              } else {
                                  console.log('Data inserted successfully');
                                  //res.send('Data inserted successfully');
                                  res.send({ message: "Booking details inserted successfully" });
                              }
                          });
              
                  }); 

                  //____________________________INSERt GUEST into guest table__________________________________


      })

    });




    //________________________GET THE NEW BILL__________________________________

    var millisecondsPerDay = 24 * 60 * 60 * 1000;

    var length_stay = Math.round((new Date(check_out_datetime).getTime() - new Date(check_in_datetime).getTime()) / (1000*60*60*24));

    console.log(length_stay);

    if (bookingType === "pending"){


                //____________________________PACKAGE INSERT____________________________________

                var sql_check_package_accom = `select * from packages where package_code = ?`;

                connection.query(sql_check_package_accom, [package], (err, rows1)=>{

                  var accom_type = rows1[0].accom_type;

                  console.log(accom_type);

                  if(accom_type == "villa"){

                          var package_code = rows1[0].package_code2;

                          var sql_select_package = `select room_id from packages where package_code2 = ?`;

                          connection.query(sql_select_package, [package_code], (err, rows2)=>{


                            //________________Traverese in room__________________

                            for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                              var room_name = rows2[rows2_c].room_id;
                              var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                              
                              connection.query(update_rooms, ["pending", room_name],(err, rows3)=>{
                  
                            
                              
                  
                              });
                            }

                            //________________Traverese in room__________________
                            
                            //______________PACKAGE UPDATE USING INACTIVE ROOM______________________

                            var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;


                            connection.query(sql_select_room_inactive, ["pending"], (err, rows4)=>{

                              for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){
              
                                var room_id_inactive = rows4[rows4_c].room_name;
              
                                console.log(room_id_inactive);
              
                                var update_package = 'update packages set package_status = ? where room_id = ?';
              
                                connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{
              
                                  console.log("room updated");
              
                                  console.log("package updated")
              
                                  
              
                                });
              
                              }
              
                              var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;
              
                                  connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{
              
                                    for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){
              
                                      var package_code = rows6[rows6_c].package_code2;
              
                                      var sql_reupdate_package = `update packages set package_status = ?, check_in = ?, check_out = ? where package_code2 = ?`;
              
                                      connection.query(sql_reupdate_package, ["inactive", new Date(Number(check_in_datetime)), new Date(Number(check_out_datetime)), package_code], (err, rows7)=>{
              
                                      });
              
                                    }
              
                                    
              
                                  });
              
                            });


                            //______________PACKAGE UPDATE USING INACTIVE ROOM______________________

                          });

                  }



                  else if(accom_type == "room"){

                    var package_code = rows1[0].package_code;
                    console.log(package_code);

                    var sql_select_package = `select room_id from packages where package_code = ?`;

                    connection.query(sql_select_package, [package_code], (err, rows2)=>{

                      for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                        
                        var room_name = rows2[rows2_c].room_id;
                        var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                        connection.query(update_rooms, ["pending", room_name],(err, rows3)=>{

                      
                        });
                      }

                      

                        //update package using room

                        var sql_select_room_inactive = `select room_name from rooms where room_status = ? or room_status = ?`;

                        connection.query(sql_select_room_inactive, ["inactive", "pending"], (err, rows4)=>{

                          for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                            var room_id_inactive = rows4[rows4_c].room_name;

                            console.log(room_id_inactive);

                            var update_package = 'update packages set package_status = ? where room_id = ?';

                            connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                              console.log("room updated");

                              console.log("package updated")

                              

                            });

                          }

                          var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                          connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                            for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                              var package_code = rows6[rows6_c].package_code2;

                              var sql_reupdate_package = `update packages set package_status = ?, check_in = ?, check_out = ? where package_code2 = ?`;

                              connection.query(sql_reupdate_package, ["inactive", new Date(Number(check_in_datetime)), new Date(Number(check_out_datetime)), package_code], (err, rows7)=>{

                              });

                            }

                          });

                        });

                      

                    });

                  }

                });

                //____________________________PACKAGE INSERT___________________________________

       }



       else if(bookingType === "reserved"){

         //____________________________PACKAGE INSERT____________________________________

         var sql_check_package_accom = `select * from packages where package_code = ?`;

         connection.query(sql_check_package_accom, [package], (err, rows1)=>{

           var accom_type = rows1[0].accom_type;

           console.log(accom_type);

           if(accom_type == "villa"){

                   var package_code = rows1[0].package_code2;

                   var sql_select_package = `select room_id from packages where package_code2 = ?`;

                   connection.query(sql_select_package, [package_code], (err, rows2)=>{


                     //________________Traverese in room__________________

                     for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                       var room_name = rows2[rows2_c].room_id;
                       var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                       
                       connection.query(update_rooms, ["reserved", room_name],(err, rows3)=>{
           
                     
                       
           
                       });
                     }

                     //________________Traverese in room__________________
                     
                     //______________PACKAGE UPDATE USING INACTIVE ROOM______________________

                     var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;


                     connection.query(sql_select_room_inactive, ["reserved"], (err, rows4)=>{

                       for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){
       
                         var room_id_inactive = rows4[rows4_c].room_name;
       
                         console.log(room_id_inactive);
       
                         var update_package = 'update packages set package_status = ? where room_id = ?';
       
                         connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{
       
                           console.log("room updated");
       
                           console.log("package updated")
       
                           
       
                         });
       
                       }
       
                       var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;
       
                           connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{
       
                             for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){
       
                               var package_code = rows6[rows6_c].package_code2;
       
                               var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;
       
                               connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{
       
                               });
       
                             }
       
                             
       
                           });
       
                     });


                     //______________PACKAGE UPDATE USING INACTIVE ROOM______________________

                   });

           }



           else if(accom_type == "room"){

             var package_code = rows1[0].package_code;
             console.log(package_code);

             var sql_select_package = `select room_id from packages where package_code = ?`;

             connection.query(sql_select_package, [package_code], (err, rows2)=>{

               for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                 
                 var room_name = rows2[rows2_c].room_id;
                 var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                 connection.query(update_rooms, ["reserved", room_name],(err, rows3)=>{

               
                 });
               }

               

                 //update package using room

                 var sql_select_room_inactive = `select room_name from rooms where room_status = ? or room_status = ?`;

                 connection.query(sql_select_room_inactive, ["reserved", "pending"], (err, rows4)=>{

                   for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                     var room_id_inactive = rows4[rows4_c].room_name;

                     console.log(room_id_inactive);

                     var update_package = 'update packages set package_status = ? where room_id = ?';

                     connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                       console.log("room updated");

                       console.log("package updated")

                       

                     });

                   }

                   var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                   connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                     for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                       var package_code = rows6[rows6_c].package_code2;

                       var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                       connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                       });

                     }

                   });

                 });

               

             });

           }

         });

         //____________________________PACKAGE INSERT___________________________________

       }


    

  });





  //__________________________________________GUEST UPDATE____________________________________________

  app.post("/UpdateGuestTable", (req, res)=>{

    var transaction_id2 = req.body.transaction_id2;
    var guest_status = req.body.guest_status;
   // var package_code = req.body.package_code;
  
    console.log(guest_status);
  
    console.log(transaction_id2);
  
  
    //check the update status if CHECK_OUT

    //_______________________________UPDATE IF CLEANING____________________________________

    
    if(guest_status === "CLEANING"){
  
      const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;

      connection.query(sql,[guest_status, transaction_id2], (err, results)=>{

        if (err) {
          console.error('error running query:', err);
          //return;
        }

        //get the accpmodation type

        

        var sql_select_package= `select * from guest_table where transaction_id2 = ?`;

        connection.query(sql_select_package, [transaction_id2], (err, rows9)=>{

          var package_code = rows9[0].package;

          var sql_get_accom = `select * from packages where package_code = ?`;

          connection.query(sql_get_accom, [package_code], (err, rows10)=>{

            var accom_type = rows10[0].accom_type;

            //if else of villa and room



                              
                            if(accom_type == "villa"){
                              var package_code = rows10[0].package_code2;
                              console.log(package_code);

                              var sql_select_package = `select room_id from packages where package_code2 = ?`;

                              connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                  var room_name = rows2[rows2_c].room_id;
                                  var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                  connection.query(update_rooms, ["cleaning", room_name],(err, rows3)=>{

                                
                                  

                                  });
                                }

                                    //update package using room

                                    var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
                                    connection.query(sql_select_room_inactive, ["cleaning"], (err, rows4)=>{

                                      for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                        var room_id_inactive = rows4[rows4_c].room_name;

                                        console.log(room_id_inactive);

                                        var update_package = 'update packages set package_status = ? where room_id = ?';

                                        connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                          console.log("room updated");

                                          console.log("package updated")

                                          

                                        });

                                      }

                                      var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                          connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                            for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                              var package_code = rows6[rows6_c].package_code2;

                                              var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                              connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                              });

                                            }

                                            

                                          });

                                    });

                      
                              });

                            
                            }




                            else if(accom_type == "room"){

                              var package_code = rows10[0].package_code;
                              console.log(package_code);

                              var sql_select_package = `select room_id from packages where package_code = ?`;

                              connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                  
                                  var room_name = rows2[rows2_c].room_id;
                                  var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                  connection.query(update_rooms, ["cleaning", room_name],(err, rows3)=>{

                                
                                  });
                                }

                                

                                  //update package using room

                                  var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;

                                  connection.query(sql_select_room_inactive, ["cleaning"], (err, rows4)=>{

                                    for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                      var room_id_inactive = rows4[rows4_c].room_name;

                                      console.log(room_id_inactive);

                                      var update_package = 'update packages set package_status = ? where room_id = ?';

                                      connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                        console.log("room updated");

                                        console.log("package updated")

                                        

                                      });

                                    }

                                    var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                    connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                      for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                        var package_code = rows6[rows6_c].package_code2;

                                        var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                        connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                        });

                                      }

                                    });

                                  });

                                

                              });

                            }

  //if else of villa and room

      });

    });

  });


}

    //_______________________________UPDATE IF CLEANING___________________________________


    //____________________________UPDATE IF CHECK OUT_____________________________________________
  
    else if(guest_status ==="CANCELLED"){
  
              const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;
  
              connection.query(sql,[guest_status, transaction_id2], (err, results)=>{
  
                if (err) {
                  console.error('error running query:', err);
                  //return;
                }
  
                //get the accpmodation type
  
                
  
                var sql_select_package= `select * from guest_table where transaction_id2 = ?`;
  
                connection.query(sql_select_package, [transaction_id2], (err, rows9)=>{
  
                  var package_code = rows9[0].package;
  
                  var sql_get_accom = `select * from packages where package_code = ?`;
  
                  connection.query(sql_get_accom, [package_code], (err, rows10)=>{
  
                    var accom_type = rows10[0].accom_type;
  
                    //if else of villa and room
  
  
  
                                      
                                    if(accom_type == "villa"){
                                      var package_code = rows10[0].package_code2;
                                      console.log(package_code);
  
                                      var sql_select_package = `select room_id from packages where package_code2 = ?`;
  
                                      connection.query(sql_select_package, [package_code], (err, rows2)=>{
  
                                        for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                          var room_name = rows2[rows2_c].room_id;
                                          var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                          connection.query(update_rooms, ["active", room_name],(err, rows3)=>{
  
                                        
                                          
  
                                          });
                                        }
  
                                            //update package using room
  
                                            var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
                                            connection.query(sql_select_room_inactive, ["active"], (err, rows4)=>{
  
                                              for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){
  
                                                var room_id_inactive = rows4[rows4_c].room_name;
  
                                                console.log(room_id_inactive);
  
                                                var update_package = 'update packages set package_status = ? where room_id = ?';
  
                                                connection.query(update_package, ["active", room_id_inactive], (err, rows5)=>{
  
                                                  console.log("room updated");
  
                                                  console.log("package updated")
  
                                                  
  
                                                });
  
                                              }
  
                                              var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;
  
                                                  connection.query(select_sql_reupdate, ["active", "villa"], (err, rows6)=>{
  
                                                    for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){
  
                                                      var package_code = rows6[rows6_c].package_code2;
  
                                                      var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;
  
                                                      connection.query(sql_reupdate_package, ["active", package_code], (err, rows7)=>{
  
                                                      });
  
                                                    }
  
                                                    
  
                                                  });
  
                                            });
  
                              
                                      });
  
                                    
                                    }
  
  
  
  
                                    else if(accom_type == "room"){
  
                                      var package_code = rows10[0].package_code;
                                      console.log(package_code);
  
                                      var sql_select_package = `select room_id from packages where package_code = ?`;
  
                                      connection.query(sql_select_package, [package_code], (err, rows2)=>{
  
                                        for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                          
                                          var room_name = rows2[rows2_c].room_id;
                                          var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                          connection.query(update_rooms, ["active", room_name],(err, rows3)=>{
  
                                        
                                          });
                                        }
  
                                        
  
                                          //update package using room
  
                                          var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
  
                                          connection.query(sql_select_room_inactive, ["active"], (err, rows4)=>{
  
                                            for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){
  
                                              var room_id_inactive = rows4[rows4_c].room_name;
  
                                              console.log(room_id_inactive);
  
                                              var update_package = 'update packages set package_status = ? where room_id = ?';
  
                                              connection.query(update_package, ["active", room_id_inactive], (err, rows5)=>{
  
                                                console.log("room updated");
  
                                                console.log("package updated")
  
                                                
  
                                              });
  
                                            }
  
                                            var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;
  
                                            connection.query(select_sql_reupdate, ["active", "villa"], (err, rows6)=>{
  
                                              for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){
  
                                                var package_code = rows6[rows6_c].package_code2;
  
                                                var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;
  
                                                connection.query(sql_reupdate_package, ["active", package_code], (err, rows7)=>{
  
                                                });
  
                                              }
  
                                            });
  
                                          });
  
                                        
  
                                      });
  
                                    }
  
          //if else of villa and room
  
              });
  
            });
  
          });
  
  
        }

        //____________________________UPDATE IF CHECK OUT_____________________________________________


        //__________________________UPDATE CHECK OUT BILL_____________________________________________



        else if(guest_status === "CHECKED_OUT"){
  
          const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;

          connection.query(sql,[guest_status, transaction_id2], (err, results)=>{

            if (err) {
              console.error('error running query:', err);
              //return;
            }

            //get the accpmodation type

            

            var sql_select_package= `select * from guest_table where transaction_id2 = ?`;

            connection.query(sql_select_package, [transaction_id2], (err, rows9)=>{

              var package_code = rows9[0].package;

              var sql_get_accom = `select * from packages where package_code = ?`;

              connection.query(sql_get_accom, [package_code], (err, rows10)=>{

                var accom_type = rows10[0].accom_type;

                //if else of villa and room



                                  
                                if(accom_type == "villa"){
                                  var package_code = rows10[0].package_code2;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code2 = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["active", room_name],(err, rows3)=>{

                                    
                                      

                                      });
                                    }

                                        //update package using room

                                        var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
                                        connection.query(sql_select_room_inactive, ["active"], (err, rows4)=>{

                                          for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                            var room_id_inactive = rows4[rows4_c].room_name;

                                            console.log(room_id_inactive);

                                            var update_package = 'update packages set package_status = ? where room_id = ?';

                                            connection.query(update_package, ["active", room_id_inactive], (err, rows5)=>{

                                              console.log("room updated");

                                              console.log("package updated")

                                              

                                            });

                                          }

                                          var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                              connection.query(select_sql_reupdate, ["active", "villa"], (err, rows6)=>{

                                                for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                                  var package_code = rows6[rows6_c].package_code2;

                                                  var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                                  connection.query(sql_reupdate_package, ["active", package_code], (err, rows7)=>{

                                                  });

                                                }

                                                

                                              });

                                        });

                          
                                  });

                                
                                }




                                else if(accom_type == "room"){

                                  var package_code = rows10[0].package_code;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["active", room_name],(err, rows3)=>{

                                    
                                      });
                                    }

                                    

                                      //update package using room

                                      var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;

                                      connection.query(sql_select_room_inactive, ["active"], (err, rows4)=>{

                                        for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                          var room_id_inactive = rows4[rows4_c].room_name;

                                          console.log(room_id_inactive);

                                          var update_package = 'update packages set package_status = ? where room_id = ?';

                                          connection.query(update_package, ["active", room_id_inactive], (err, rows5)=>{

                                            console.log("room updated");

                                            console.log("package updated")

                                            

                                          });

                                        }

                                        var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                        connection.query(select_sql_reupdate, ["active", "villa"], (err, rows6)=>{

                                          for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                            var package_code = rows6[rows6_c].package_code2;

                                            var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                            connection.query(sql_reupdate_package, ["active", package_code], (err, rows7)=>{

                                            });

                                          }

                                        });

                                      });

                                    

                                  });

                                }

      //if else of villa and room

          });

        });

      });

      var selectTransaction = `select * from guest_table where transaction_id2 = ?`;
      
      connection.query(selectTransaction, [transaction_id2], (err, rows11)=>{
        var transaction_id = rows11[0].transaction_id2;
        var insert_guest_id = rows11[0].guest_id;
        var current_bill = rows11[0].current_bill;

        var insertTransaction = `insert into billing_table (transaction_id2, guest_id, bill) values (?,?,?)`;

        connection.query(insertTransaction, [transaction_id, insert_guest_id, current_bill], (err, rows12)=>{

        });


        

      });


    }



        //__________________________UPDATE CHECK OUT BILL_____________________________________________

        
        
        //___________________________UPDATE IF CHECKED IN____________________________________________


        else if(guest_status === "CHECKED_IN"){
  
          const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;

          connection.query(sql,[guest_status, transaction_id2], (err, results)=>{

            if (err) {
              console.error('error running query:', err);
              //return;
            }

            //get the accpmodation type

            

            var sql_select_package= `select * from guest_table where transaction_id2 = ?`;

            connection.query(sql_select_package, [transaction_id2], (err, rows9)=>{

              var package_code = rows9[0].package;

              var sql_get_accom = `select * from packages where package_code = ?`;

              connection.query(sql_get_accom, [package_code], (err, rows10)=>{

                var accom_type = rows10[0].accom_type;

                //if else of villa and room



                                  
                                if(accom_type == "villa"){
                                  var package_code = rows10[0].package_code2;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code2 = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["occupied", room_name],(err, rows3)=>{

                                    
                                      

                                      });
                                    }

                                        //update package using room

                                        var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
                                        connection.query(sql_select_room_inactive, ["occupied"], (err, rows4)=>{

                                          for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                            var room_id_inactive = rows4[rows4_c].room_name;

                                            console.log(room_id_inactive);

                                            var update_package = 'update packages set package_status = ? where room_id = ?';

                                            connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                              console.log("room updated");

                                              console.log("package updated")

                                              

                                            });

                                          }

                                          var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                              connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                                for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                                  var package_code = rows6[rows6_c].package_code2;

                                                  var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                                  connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                                  });

                                                }

                                                

                                              });

                                        });

                          
                                  });

                                
                                }




                                else if(accom_type == "room"){

                                  var package_code = rows10[0].package_code;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["occupied", room_name],(err, rows3)=>{

                                    
                                      });
                                    }

                                    

                                      //update package using room

                                      var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;

                                      connection.query(sql_select_room_inactive, ["occupied"], (err, rows4)=>{

                                        for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                          var room_id_inactive = rows4[rows4_c].room_name;

                                          console.log(room_id_inactive);

                                          var update_package = 'update packages set package_status = ? where room_id = ?';

                                          connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                            console.log("room updated");

                                            console.log("package updated")

                                            

                                          });

                                        }

                                        var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                        connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                          for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                            var package_code = rows6[rows6_c].package_code2;

                                            var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                            connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                            });

                                          }

                                        });

                                      });

                                    

                                  });

                                }

      //if else of villa and room

          });

        });

      });


    }


        //___________________________UPDATE IF CHECKED IN____________________________________________


        //_________________________UPDATE IF CONFIRMED_______________________________________________

        else if(guest_status === "CONFIRMED"){
  
          const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;

          connection.query(sql,[guest_status, transaction_id2], (err, results)=>{

            if (err) {
              console.error('error running query:', err);
              //return;
            }

            //get the accpmodation type

            

            var sql_select_package= `select * from guest_table where transaction_id2 = ?`;

            connection.query(sql_select_package, [transaction_id2], (err, rows9)=>{

              var package_code = rows9[0].package;

              var sql_get_accom = `select * from packages where package_code = ?`;

              connection.query(sql_get_accom, [package_code], (err, rows10)=>{

                var accom_type = rows10[0].accom_type;

                //if else of villa and room



                                  
                                if(accom_type == "villa"){
                                  var package_code = rows10[0].package_code2;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code2 = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["confirmed", room_name],(err, rows3)=>{

                                    
                                      

                                      });
                                    }

                                        //update package using room

                                        var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;
                                        connection.query(sql_select_room_inactive, ["occupied"], (err, rows4)=>{

                                          for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                            var room_id_inactive = rows4[rows4_c].room_name;

                                            console.log(room_id_inactive);

                                            var update_package = 'update packages set package_status = ? where room_id = ?';

                                            connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                              console.log("room updated");

                                              console.log("package updated")

                                              

                                            });

                                          }

                                          var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                              connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                                for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                                  var package_code = rows6[rows6_c].package_code2;

                                                  var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                                  connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                                  });

                                                }

                                                

                                              });

                                        });

                          
                                  });

                                
                                }




                                else if(accom_type == "room"){

                                  var package_code = rows10[0].package_code;
                                  console.log(package_code);

                                  var sql_select_package = `select room_id from packages where package_code = ?`;

                                  connection.query(sql_select_package, [package_code], (err, rows2)=>{

                                    for(var rows2_c=0; rows2_c<rows2.length; rows2_c++){
                                      
                                      var room_name = rows2[rows2_c].room_id;
                                      var update_rooms = 'update rooms set room_status = ? where room_name = ?';
                                      connection.query(update_rooms, ["confirmed", room_name],(err, rows3)=>{

                                    
                                      });
                                    }

                                    

                                      //update package using room

                                      var sql_select_room_inactive = `select room_name from rooms where room_status = ?`;

                                      connection.query(sql_select_room_inactive, ["occupied"], (err, rows4)=>{

                                        for(var rows4_c = 0; rows4_c<rows4.length; rows4_c++){

                                          var room_id_inactive = rows4[rows4_c].room_name;

                                          console.log(room_id_inactive);

                                          var update_package = 'update packages set package_status = ? where room_id = ?';

                                          connection.query(update_package, ["inactive", room_id_inactive], (err, rows5)=>{

                                            console.log("room updated");

                                            console.log("package updated")

                                            

                                          });

                                        }

                                        var select_sql_reupdate = `select * from packages where package_status = ? and accom_type = ?`;

                                        connection.query(select_sql_reupdate, ["inactive", "villa"], (err, rows6)=>{

                                          for(var rows6_c = 0; rows6_c<rows6.length; rows6_c++){

                                            var package_code = rows6[rows6_c].package_code2;

                                            var sql_reupdate_package = `update packages set package_status = ? where package_code2 = ?`;

                                            connection.query(sql_reupdate_package, ["inactive", package_code], (err, rows7)=>{

                                            });

                                          }

                                        });

                                      });

                                    

                                  });

                                }

      //if else of villa and room

          });

        });

      });


    }


        //_________________________UPDATE IF CONFIRMED_______________________________________________



     
  
        //check the update status if CHECK_OUT
  
        else if(guest_status == "CHECKED_IN" || guest_status == "PENDING"){
  
          const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;
  
              connection.query(sql,[guest_status, transaction_id2], (err, results)=>{
  
              });
  
        }

        res.send({message:"Guest Updated"})
  
  });



  app.post('/ViewGuest', (req, res)=>{
  
    const transaction_id2 = req.body.transaction_id2;
    //const transaction_id2 = req.params.transaction_id2;
    console.log(transaction_id2);
    
    var sql_guest_table = `select guest_table.*, packages.package_name from guest_table 
                            inner join packages on guest_table.package = packages.package_code
                            where transaction_id2 = ?`;
  
    connection.query(sql_guest_table,[transaction_id2],(err, results)=>{
  
      if (err) {
        console.error('error running query:', err);
        //return;
      }
      //res.send({room:results});
      console.log(results[0].package)
      console.log(results[0].package_name)
           
      res.send
            ({
              full_name:results[0].full_name,
              guest_id:results[0].guest_id,
              package:results[0].package,
              guest_status:results[0].guest_status,
              check_in_datetime:results[0].check_in_datetime,
              check_out_datetime:results[0].check_out_datetime,
              length_stay: results[0].length_stay,
              transaction_id2:results[0].transaction_id2,
              current_stay:results[0].current_stay,
              current_bill:results[0].current_bill,
              package_name:results[0].package_name
            });
  
    });
  
  });




   //__________________________________________GUEST UPDATE____________________________________________

   //___________________________________________UPDATE GUEST TABLE________________________________

   app.post("/UpdateBill", (req, res)=>{

    var package = req.body.package;
    var transaction_id2 = req.body.transaction_id2;
    console.log(package);
    console.log(transaction_id2);
    
    var date_now_over_stay_time = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
   
    var millis_now = new Date(date_now_over_stay_time).getTime()
  
    console.log("Millis of time now")
    console.log(millis_now);
    
    var sql = `select * from packages where package_code = ?`;
  
    connection.query(sql, [package], (err, results)=>{
  
      console.log(results[0].package_rate);
  
      var package_rate = results[0].package_rate;
  
      var sql_select_guest_table = `select guest_table.*, SUM(addons_amount) as totalAddons from guest_table
                                    inner join addons_table on guest_table.transaction_id2 = addons_table.transaction_id2 where guest_table.transaction_id2 = ?`;

      var sumAddons = `select SUM(addons_amount) as totalAddonsTable from addons_table where transaction_id2 = ?`;

      connection.query(sumAddons,[transaction_id2], (err, rows20)=>{

        connection.query(sql_select_guest_table,[transaction_id2], (err2, results_transactionid)=>{
  
          var check_in_datetime = results_transactionid[0].check_in_datetime;
          var length_stay = results_transactionid[0].length_stay;
          var bill = results_transactionid[0].current_bill;
          var addons_amount = rows20[0].totalAddonsTable;
          
  
          //var new_check_in_datetime = new Date(check_in_datetime).getTime();
  
          console.log("Millis of check in date")
  
          console.log(check_in_datetime);
  
          //var current_stay  = new_check_in_datetime - millis_now;
          var current_stay  = millis_now - check_in_datetime;
  
          var current_days = current_stay/(1000*60*60*24)
  
          console.log(current_days);
          
          //check if the current day is lessthan 0 or current day is equal to zero
          
          if(parseInt(current_days) <= 0){
            var current_bill_raw = length_stay * bill;
            var current_bill = current_bill_raw;

            var addons = addons_amount;
          }
  
          else if(parseInt(current_days) > 0){
  
            var current_bill_raw = parseInt(current_days) * bill;
            var current_bill = current_bill_raw;
            var addons = addons_amount;
  
          }
  
          var sql_update_guest = `update guest_table set current_stay = ?, current_bill = ?  where transaction_id2 = ?`;
  
          connection.query(sql_update_guest, [parseInt(current_days), current_bill, transaction_id2], (err, results_update)=>{
  
            var sql_update_front = `select * from guest_table where transaction_id2 = ?`;

            var sql_sum_addons = `select SUM(addons_amount) as SUMADDONS from addons_table where transaction_id2 = ?`

            connection.query(sql_sum_addons, [transaction_id2], (err, rows22)=>{

              connection.query(sql_update_front, [transaction_id2], (err3, results_update_front)=>{
  
                res.send({
                  current_status:results_update_front,
                  add_ons_sum:rows22 
                });
  
              });

            });
  
             
  
          });
        });

      });
  
       
    });
  
  });


   //___________________________________________UPDATE GUEST TABLE________________________________

   //______________________CALL TO CHANGE THE LIST OF PACKAGE CHECK PACKAGE IF IT IS IN GUEST TABLE______________________________

   app.post("/changePackage", (req, res)=>{

    var pax = req.body.pax;
    var check_in = Date.parse(req.body.check_in);
    var check_out = Date.parse(req.body.check_out);

    console.log([check_in, check_out]);

    if(pax && check_in && check_out){

      var checkGuestTable = `select * from guest_table where check_in_datetime = ? and check_out_datetime = ?`;

      connection.query(checkGuestTable, [check_in, check_out], (err, rows23)=>{
      
      

      if(rows23.length > 0){

        var package = rows23[0].package;

                var sqlCheckPackageAccom = `select accom_type, package_code2, package_code from packages where package_code = ?`;

                connection.query(sqlCheckPackageAccom, [package], (err, rows24)=>{

                  var accom_type = rows24[0].accom_type;

                  if(accom_type == "villa"){

                    var package_code = rows24[0].package_code2;

                  }

                  else if(accom_type == "room"){

                    var package_code = rows24[0].package_code;

                  }


                 // var sql_select_set_package = `select * from packages where no_of_person <= ? and package_code != ?`;

                  var sql_select_set_package = `select * from packages where no_of_person <= ? and package_status = ?`;

                  connection.query(sql_select_set_package, [pax, "active"], (err4, result_set)=>{
                    if (err4) {
                      console.error('error running query:', err4);
                      return;
                    }
                    res.send({package_set:result_set});
      
                  });

                 /* connection.query(sql_select_set_package, [pax, package_code], (err4, result_set)=>{
                    if (err4) {
                      console.error('error running query:', err4);
                      return;
                    }
                    res.send({package_set:result_set});

                  });*/

                });

      }

      else if(rows23.length == 0){
        
      /* var sqlCheckPackageAccom = `select accom_type, package_code2, package_code from packages where package_code = ?`;

          connection.query(sqlCheckPackageAccom, [package], (err, rows24)=>{

            var accom_type = rows24[0].accom_type;

            if(accom_type == "villa"){

              var package_code = rows24[0].package_code2;

            }

            else if(accom_type == "room"){

              var package_code = rows24[0].package_code;

            }


            

          });*/


          var sql_select_set_package = `select * from packages where no_of_person <= ?`;

            connection.query(sql_select_set_package, [pax], (err4, result_set)=>{
              if (err4) {
                console.error('error running query:', err4);
                return;
              }
              res.send({package_set:result_set});

            });
      }

      


      //var sql_select_set_package = `select * from packages where no_of_person <= ? and package_code`;

           /* connection.query(sql_select_set_package, [pax, "active"], (err4, result_set)=>{
              if (err4) {
                console.error('error running query:', err4);
                return;
              }
              res.send({package_set:result_set});

            });*/
      })



    }


    else{

       /*var sql_select_set_package = `select * from packages where no_of_person <= ? and package_status = ?`;

            connection.query(sql_select_set_package, [pax, "active"], (err4, result_set)=>{
              if (err4) {
                console.error('error running query:', err4);
                return;
              }
              res.send({package_set:result_set});

            });*/

    }

    console.log(pax)

    

   });


   //______________________CALL TO CHANGE THE LIST OF PACKAGE CHECK PACKAGE IF IT IS IN GUEST TABLE______________________________


   //__________________________CALL TO CHANGE THE PRICE_____________________________________

   app.post("/onchangePackage", (req, res)=>{

    var package_code = req.body.package_code;
    console.log(package_code);

    var sqlSelectPackage = `select package_rate from packages where package_code = ?`;

    connection.query(sqlSelectPackage, [package_code], (err, rows18)=>{
      res.send({packageCodeData:rows18})
    })

   });


   //__________________________CALL TO CHANGE THE PRICE_____________________________________


   //______________________________CALL TO CHANGE PRICE BASED ON RATE_______________________

    app.post("/onchangeRate", (req, res)=>{

      var rate_no = req.body.rate_no;

      var sqlSelectRate = `select * from rate_type where rate_no = ?`;

      connection.query(sqlSelectRate, [rate_no], (err, rows19)=>{

        res.send({rateData:rows19})

      });

    });

    //______________________________CALL TO CHANGE PRICE BASED ON RATE_______________________
   

   




   //______________________________LOGIN________________________________

   app.post("/loginEnter", (req, res) => {
    var { username, user_password } = req.body;
  
    var sql_select_users = `SELECT * FROM users WHERE username = ? AND user_password = ?`;
  
    connection.query(sql_select_users, [username, user_password], (err, rows2) => {
      if (err) {
        console.error("Database error:", err);
        return res.send({ validation: "error" });
      }
  
      if (rows2.length > 0) {
        req.session.user = username; // Set session variable
        console.log("Session created:", req.session.user);
  
      
          if (err) console.error("Session save error:", err);
          res.render('layout',{
            title: "Home",
            content: 'home.ejs'
        });
   
  
      } 
      
      else {
        console.log("No existing account");
        res.render('login-page.ejs');
      }
    });
  });

  //______________________________LOGIN________________________________
  
  //__________________UPDATE GUEST BILL_______________________________

  app.post("/UpdateGuestBill", (req, res)=>{

    var adjustment_amount = req.body.adjustment_amount;
    var adjustment_remarks = req.body.adjustment_remarks;
    var adjustment_type = req.body.adjustment_type;
    var transaction_text = req.body.transaction_text;

    console.log([adjustment_remarks, adjustment_amount, adjustment_type, transaction_text])

    if (req.body.adjustment_type === "add"){
      var selectBill = `select * from billing_table where transaction_id2 = ?`;

      connection.query(selectBill, [transaction_text], (err, rows13)=>{

        var bill = rows13[0].bill;
        var newBill = Number(bill) + Number(adjustment_amount);

        var sqlUpdateBill = `update billing_table set bill = ?, adjustment_remarks = ?, adjustment_amount = ?, adjustment_type = ? where transaction_id2 = ?`;

        connection.query(sqlUpdateBill, [newBill, adjustment_remarks, adjustment_amount, adjustment_type, transaction_text], (err, rows14)=>{
          console.log("bill updated");
          res.send({message:"Bill updated"})
        })

      });

    }

    else if (req.body.adjustment_type === "minus"){

      var selectBill = `select * from billing_table where transaction_id2 = ?`;

      connection.query(selectBill, [transaction_text], (err, rows13)=>{

        var bill = rows13[0].bill;
        var newBill = Number(bill) - Number(adjustment_amount);

        var sqlUpdateBill = `update billing_table set bill = ?, adjustment_remarks = ?, adjustment_amount = ?, adjustment_type = ? where transaction_id2 = ?`;

        connection.query(sqlUpdateBill, [newBill, adjustment_remarks, adjustment_amount, adjustment_type, transaction_text], (err, rows14)=>{
          console.log("bill updated");
          res.send({message:"Bill updated"})
        })

      });
      
    }

  })


  //__________________UPDATE GUEST BILL_______________________________





    //__________________UPDATE GUEST BILL not final_______________________________

    app.post("/UpdateGuestBilNotFinal", (req, res)=>{

      var adjustment_amount = req.body.adjustment_amount;
      var adjustment_remarks = req.body.adjustment_remarks;
      var adjustment_type = req.body.adjustment_type;
      var transaction_text = req.body.transaction_text;
  
      console.log([adjustment_remarks, adjustment_amount, adjustment_type, transaction_text])
  
      if (req.body.adjustment_type === "add"){
        var selectBill = `select * from guest_table where transaction_id2 = ?`;
  
        connection.query(selectBill, [transaction_text], (err, rows13)=>{
  
          var bill = rows13[0].current_bill;
          var newBill = Number(bill) + Number(adjustment_amount);
  
          var sqlUpdateBill = `update guest_table set current_bill = ?, adjustment_remarks = ?, adjustment_amount = ?, adjustment_type = ? where transaction_id2 = ?`;
  
          connection.query(sqlUpdateBill, [newBill, adjustment_remarks, adjustment_amount, adjustment_type, transaction_text], (err, rows14)=>{
            console.log("bill updated");
            res.send({message:"Bill Updated"})
          })
  
        });
  
      }
  
      else if (req.body.adjustment_type === "minus"){
  
        var selectBill = `select * from guest_table where transaction_id2 = ?`;
  
        connection.query(selectBill, [transaction_text], (err, rows13)=>{
  
          var bill = rows13[0].current_bill;
          var newBill = Number(bill) - Number(adjustment_amount);
  
          var sqlUpdateBill = `update guest_table set current_bill = ?, adjustment_remarks = ?, adjustment_amount = ?, adjustment_type = ? where transaction_id2 = ?`;
  
         
          connection.query(sqlUpdateBill, [newBill, adjustment_remarks, adjustment_amount, adjustment_type, transaction_text], (err, rows14)=>{
            console.log("bill updated");
            res.send({message:"Bill Updated"})
          })
  
        });
        
      }
  
    })
  
  
    //__________________UPDATE GUEST BILL not final_______________________________
  
  //_________________BILLING ADDONS___________________________________

  app.post("/addons", (req, res)=>{
    var addons_remarks = req.body.addons_remarks;
    var addons_amount = req.body.addons_amount;
    var addons_description = req.body.addons_description;
    var transaction_id2 = req.body.transaction_id2;

    var sqlInsertAddons = `insert into addons_table (transaction_id2, addons_amount, addons_remarks, addons_description) values(?, ?, ?, ?)`;

    connection.query(sqlInsertAddons, [transaction_id2, addons_amount, addons_remarks, addons_description], (err, rows17)=>{

      console.log("Addons added")
      res.send({rows:rows17})

    });

  });


  //_________________BILLING ADDONS___________________________________


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
