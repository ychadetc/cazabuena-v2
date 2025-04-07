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

app.get('/login', (req, res)=>{
  res.render('login-page.ejs');
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

app.get('/room-registration', (req, res)=>{
res.render('room-registration.ejs');
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
    console.log(bookingType);


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


    //____________________________INSERt GUEST into guest table__________________________________

    var sql_select_guest = `select full_name from personal_details_table where guest_id = ?`;

    connection.query(sql_select_guest, [guest_id], (err, result)=>{
 
          var full_name = result[0].full_name;
 
 
          var sql_insert_book = `INSERT INTO guest_table (guest_id, check_in_datetime, check_out_datetime,
          no_pax, package, special_request, length_stay, guest_status, full_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
             connection.query(sql_insert_book, [guest_id, check_in_datetime, check_out_datetime,
               no_pax, package, special_request, length_stay, guest_status, full_name], (err, results) => {
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
  
    else if(guest_status === "CHECKED_OUT" || guest_status ==="CANCELLED"){
  
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


     
  
        //check the update status if CHECK_OUT
  
        else if(guest_status == "CHECKED_IN" || guest_status == "PENDING"){
  
          const sql = `update guest_table set guest_status = ? where transaction_id2 = ?`;
  
              connection.query(sql,[guest_status, transaction_id2], (err, results)=>{
  
              });
  
        }
  
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
  
      var sql_select_guest_table = `select * from guest_table where transaction_id2 = ?`;
  
        connection.query(sql_select_guest_table,[transaction_id2], (err2, results_transactionid)=>{
  
          var check_in_datetime = results_transactionid[0].check_in_datetime;
          var length_stay = results_transactionid[0].length_stay;
  
          //var new_check_in_datetime = new Date(check_in_datetime).getTime();
  
          console.log("Millis of check in date")
  
          console.log(check_in_datetime);
  
          //var current_stay  = new_check_in_datetime - millis_now;
          var current_stay  = millis_now - check_in_datetime;
  
          var current_days = current_stay/(1000*60*60*24)
  
          console.log(current_days);
          
          //check if the current day is lessthan 0 or current day is equal to zero
          
          if(parseInt(current_days) <= 0){
            var current_bill = length_stay * package_rate;
          }
  
          else if(parseInt(current_days) > 0){
  
            var current_bill = parseInt(current_days) * package_rate;
  
          }
  
          var sql_update_guest = `update guest_table set current_stay = ?, current_bill = ? where transaction_id2 = ?`;
  
          connection.query(sql_update_guest, [parseInt(current_days), current_bill, transaction_id2], (err, results_update)=>{
  
            var sql_update_front = `select * from guest_table where transaction_id2 = ?`;
  
              connection.query(sql_update_front, [transaction_id2], (err3, results_update_front)=>{
  
                res.send({
                  current_status:results_update_front
                });
  
              });
  
          });
        });
    });
  
  });


   //___________________________________________UPDATE GUEST TABLE________________________________

   //______________________CALL TO CHANGE THE LIST OF PACKAGE______________________________

   app.post("/changePackage", (req, res)=>{

    var pax = req.body.pax;

    console.log(pax)

    var sql_select_set_package = `select * from packages where no_of_person <= ? and package_status = ?`

    connection.query(sql_select_set_package, [pax, "active"], (err4, result_set)=>{
      if (err4) {
        console.error('error running query:', err4);
        return;
      }
      res.send({package_set:result_set});

    });

   });
   //______________________CALL TO CHANGE THE LIST OF PACKAGE______________________________




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
  
  


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
