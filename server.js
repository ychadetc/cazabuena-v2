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


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
