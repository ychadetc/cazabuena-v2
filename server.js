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
  database: 'cazabuena'
})

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session({
  store: new FileStore({ path: '../sessions', logFn: function() {} }), // Store sessions in the "sessions" folder
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1-day session persistence
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('layout',{
        title: "Home",
        content: 'home.ejs'
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
    var guest_status = 'PENDING';
    var check_in_datetime = Date.parse(req.body.check_in_datetime);
    var check_out_datetime = Date.parse(req.body.check_out_datetime);


    var millisecondsPerDay = 24 * 60 * 60 * 1000;

    var length_stay = Math.round((new Date(check_out_datetime).getTime() - new Date(check_in_datetime).getTime()) / (1000*60*60*24));

    console.log(length_stay);


    //________________PACKAGE INSERT_______________________________

    //________________PACKAGE INSERT_______________________________



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
                 }
             });
 
    }); 

     //____________________________INSERt GUEST into guest table__________________________________


  });
  


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
