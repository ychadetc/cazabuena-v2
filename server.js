const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mysql = require('mysql');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const util = require('util');

const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cazabuena',
  port: 3306
})

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const queryAsync = util.promisify(connection.query).bind(connection);

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

app.get('/modal-billing-print', (req, res) =>{
  res.render('modal-billing-print.ejs');  
});

app.get('/guest-register', (req, res) =>{
    res.render('modal-guest-reg.ejs');
});
  
app.get('/villa-registration', (req, res)=>{
    res.render('villa-registration.ejs');
})


//REPORT______________

app.get('/fetch-reports', (req, res) =>{
  res.render('reports.ejs');
});
//REPORT END_____________


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

app.get('/guest-list', (req, res)=>{
  res.render('guestlist.ejs');

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


app.post("/InsertGuest", (req, res) => {
  var full_name = req.body.full_name;
  var contact_number = req.body.contact_number;
  var email = req.body.email;
  var age = req.body.age;
  var guest_id = Math.floor(Math.random() * 90000) + 10000;

  var sql_insert = `
    insert into personal_details_table (full_name, contact_number, email, age, guest_id)
    values (?, ?, ?, ?, ?)
  `;

  connection.query(sql_insert, [full_name, contact_number, email, age, guest_id], (err, rows, fields) => {
    if (err) {
      console.error('Error inserting guest:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ success: true, rows });
  });
});



app.post("/InsertVilla", (req, res) => {
  var villa_name = req.body.villa_name;
  var villa_status = req.body.villa_status;
  var color_code = req.body.color_code;

  var sql_insert = `insert into villas (villa_name, villa_status, color_code) values(?,?,?)`;

  connection.query(sql_insert, [villa_name, villa_status, color_code], (err, rows, fields) => {
    if (err) {
      console.error('Error inserting villa:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ success: true, rows });
  });
});


app.post("/InsertRoom", (req, res) => {
  var room_name = req.body.room_name;
  var room_status = req.body.room_status;
  var location = req.body.location;
  var villa_id = req.body.villa_id;

  var sql_insert = `insert into rooms (room_name, room_status, location, villa_id) values(?,?,?,?)`;

  connection.query(sql_insert, [room_name, room_status, location, villa_id], (err, rows, fields) => {
    if (err) {
      console.error('Error inserting room:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ success: true, rows });
  });
});


app.get('/villas', (req, res) => {
  var query = 'SELECT * FROM villas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching villas:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ villas: results });
  });
});

app.get('/rooms', (req, res) => {
  var query = 'SELECT * FROM rooms';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ rooms: results });
  });
});


app.get("/roomListPlot", (req, res)=>{

  /*var sql_view_plot = `select villas.villa_name, rooms.room_name, rooms.villa_id, rooms.room_status
   from rooms inner join villas on villas.villa_name = rooms.villa_id`;

  connection.query(sql_view_plot, (err, rows_plot)=>{

    res.send({toplotRoom:rows_plot});

  });*/


  var sql_view_plot = `WITH base_data AS (
    SELECT 
        COALESCE(guest_status_sub.guest_status, 'nostatus') AS guest_status,
        COALESCE(guest_status_sub.check_in_datetime, 'nocheckin') AS check_in_datetime,
        COALESCE(p.package_code, 'nopackage') AS package_code,
        COALESCE(p.package_code2, 'nopackage code2') AS package_code2,
        r.room_name,
        r.villa_id,
        COALESCE(p.accom_type, 'noaccomtype') AS accom_type,
        -- assign priority: 1 if it's not 'nostatus', 2 otherwise
        CASE WHEN COALESCE(guest_status_sub.guest_status, 'nostatus') = 'nostatus' THEN 2 ELSE 1 END AS status_priority
    FROM rooms r
    LEFT JOIN packages p ON r.room_name = p.room_id
    LEFT JOIN (
        SELECT 
            g.guest_status,
            g.check_in_datetime,
            pk.package_code2
        FROM guest_table g
        JOIN packages pk ON g.package = pk.package_code
    ) guest_status_sub 
    ON guest_status_sub.package_code2 = p.package_code2 
       AND guest_status_sub.check_in_datetime = 1745730000000
),
ranked_data AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY room_name ORDER BY status_priority) AS rn
    FROM base_data
)
SELECT guest_status, check_in_datetime, package_code, package_code2, room_name, villa_id, accom_type
FROM ranked_data
WHERE rn = 1;


`;



        connection.query(sql_view_plot, (err, rows_plot)=>{

          res.send({toplotRoom:rows_plot});
      
        });

});

//_____________DISPLAY PACKAGES___________________________
app.get("/packageDisplay", (req, res)=>{
  
  var sqlDisplayPackage = `Select * from packages`;

  connection.query(sqlDisplayPackage, (err, rows26)=>{

    res.send({toDisplayPackage:rows26});

  });

});

//_____________DISPLAY PACKAGES___________________________

app.post("/roomListPlot", (req, res)=>{
  
  console.log(Date.parse(req.body.check_in_datetime))

  var sql_view_plot = `WITH base_data AS (
    SELECT 
        COALESCE(guest_status_sub.guest_status, 'nostatus') AS guest_status,
        COALESCE(guest_status_sub.check_in_datetime, 'nocheckin') AS check_in_datetime,
        COALESCE(p.package_code, 'nopackage') AS package_code,
        COALESCE(p.package_code2, 'nopackage code2') AS package_code2,
        r.room_name,
        r.villa_id,
        COALESCE(p.accom_type, 'noaccomtype') AS accom_type,
        -- assign priority: 1 if it's not 'nostatus', 2 otherwise
        CASE WHEN COALESCE(guest_status_sub.guest_status, 'nostatus') = 'nostatus' THEN 2 ELSE 1 END AS status_priority
    FROM rooms r
    LEFT JOIN packages p ON r.room_name = p.room_id
    LEFT JOIN (
        SELECT 
            g.guest_status,
            g.check_in_datetime,
            pk.package_code2
        FROM guest_table g
        JOIN packages pk ON g.package = pk.package_code
    ) guest_status_sub 
    ON guest_status_sub.package_code2 = p.package_code2 
       AND guest_status_sub.check_in_datetime = ?
),
ranked_data AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY room_name ORDER BY status_priority) AS rn
    FROM base_data
)
SELECT guest_status, check_in_datetime, package_code, package_code2, room_name, villa_id, accom_type
FROM ranked_data
WHERE rn = 1;


`;


connection.query(sql_view_plot,[Date.parse(req.body.check_in_datetime)], (err, rows_plot)=>{

  res.send({toplotRoom:rows_plot});

});

  /*var sql_view_plot = `select villas.villa_name, rooms.room_name, rooms.villa_id, rooms.room_status
   from rooms inner join villas on villas.villa_name = rooms.villa_id`;*/

  

 
});


app.get('/rooms', (req, res) => {
  var query = 'SELECT * FROM rooms';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.send({ rooms: results });
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


app.get("/GuestOption", async (req, res)=>{
  try{
    
    const query = 'SELECT * FROM personal_details_table';
    const results = await queryAsync(query)
    res.send({guest:results});

  }

  catch(err){
    console.error('Error running query:', err);
    res.status(500).send('Database query failed');

  }
    
  

  });


app.get('/packages', async (req, res) => {
  try {
    const results = await queryAsync('SELECT * FROM packages WHERE package_status = ?', ['active']);
    res.send({ package: results });
  } catch (err) {
    console.error('Error running query:', err);
    res.status(500).send('Database query failed');
  }
});


app.get("/GuestTable", (req, res)=>{
    
  var query = `SELECT * FROM guest_table where guest_status != "CHECKED_OUT"`;

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




  app.post("/InsertPackage", async (req, res) => {
  try {
    const {
      package_name, no_of_person, room_id, location,
      no_of_rooms, package_code, package_rate, package_status, accom_type
    } = req.body;

    console.log([
      package_code, package_name, no_of_person,
      room_id, location, no_of_rooms, package_rate,
      package_status, accom_type
    ]);

    const sqlInsert = `
      INSERT INTO packages 
      (package_code2, package_name, no_of_person, room_id, location, no_of_rooms, package_rate, package_status, accom_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await queryAsync(sqlInsert, [
      package_code, package_name, no_of_person,
      room_id, location, no_of_rooms, package_rate,
      package_status, accom_type
    ]);

    console.log('Package inserted successfully!');
    res.send({ message: "Package inserted successfully" });
  } catch (error) {
    console.error("Error in InsertPackage:", error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post("/viewAddons", (req, res)=>{

    const transaction_id3 = req.body.transaction_id2;
    console.log(transaction_id3);

    const queryAddons = `select * from addons_table where transaction_id2 = ?`;


    connection.query(queryAddons,[transaction_id3],(err, results)=>{

    if (err) {
      console.error('error running query:', err);
      return;
    }
      res.send({addons:results});

  });

});

app.post("/viewDiscount", (req, res)=>{

  const transaction_id2 = req.body.transaction_id2;
  const queryDiscount = `select * from discount_history where transaction_id2 = ?`;

  connection.query(queryDiscount, [transaction_id2], (err, rows31)=>{

    if(err){
      console.error('error in query: ', err);
      return;
    }

    res.send({discounts:rows31});

  });

});


app.post("/viewAdjustment", (req, res)=>{

  const transaction_id2 = req.body.transaction_id2;

  const queryAdjustment = `select * from adjustment_history where transaction_id = ?`;

  connection.query(queryAdjustment, [transaction_id2], (err, rows33)=>{

    if(err){
      console.error('error in query: ', err);
      return;
    }

    res.send({adjustments:rows33})

  });

});





app.post("/InsertBooking", async (req, res) => {
  try {
    const {
      guest_id, no_pax, package, special_request,
      bookingType, check_in_datetime, check_out_datetime, rate_no
    } = req.body;


    function generateRandom9DigitNumber() {
    return Math.floor(100000000 + Math.random() * 900000000);
  }

    const transaction_id2 = generateRandom9DigitNumber();

    const guest_status = bookingType;
    const checkIn = Date.parse(check_in_datetime);
    const checkOut = Date.parse(check_out_datetime);
    const length_stay = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const [rateRow] = await queryAsync('SELECT rate_percent FROM rate_type WHERE rate_no = ?', [rate_no]);
    const [packageRow] = await queryAsync('SELECT * FROM packages WHERE package_code = ?', [package]);

    const rate_percent = rateRow.rate_percent;
    const packagePrice = packageRow.package_rate;
    const accom_type = packageRow.accom_type;

    const forBasebill = length_stay * packagePrice;

    const newCurrentBill = (rate_no === 3) ? packagePrice : packagePrice + (packagePrice * rate_percent);

    const [guestRow] = await queryAsync('SELECT full_name FROM personal_details_table WHERE guest_id = ?', [guest_id]);

    await queryAsync(`INSERT INTO guest_table 
      (guest_id, check_in_datetime, check_out_datetime, no_pax, package, special_request, length_stay, guest_status, full_name, current_bill, rate_no, transaction_id2)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [guest_id, checkIn, checkOut, no_pax, package, special_request, length_stay, guest_status, guestRow.full_name, newCurrentBill, rate_no, transaction_id2]);
    
   await queryAsync('insert into billing_table(transaction_id2, basebill, guest_id) values(?, ?, ?)', [transaction_id2,  forBasebill, guest_id]);

    await updateRoomsAndPackages(accom_type, packageRow, bookingType, checkIn, checkOut);

    res.send({ message: "Booking details inserted successfully" });
  } catch (error) {
    console.error("Error in InsertBooking:", error);
    res.status(500).send("Server error");
  }
});

async function updateRoomsAndPackages(accom_type, packageRow, status, checkIn, checkOut) {
  const roomStatus = status;
  const packageStatus = "inactive";

  const packageCode = accom_type === "villa" ? packageRow.package_code2 : packageRow.package_code;
  const sqlRoom = `SELECT room_id FROM packages WHERE ${accom_type === "villa" ? "package_code2" : "package_code"} = ?`;
  const rooms = await queryAsync(sqlRoom, [packageCode]);

  for (const room of rooms) {
    await queryAsync('UPDATE rooms SET room_status = ? WHERE room_name = ?', [roomStatus, room.room_id]);
  }

  const inactiveRooms = await queryAsync(
    'SELECT room_name FROM rooms WHERE room_status IN (?, ?)',
    ["pending", "reserved"]
  );

  for (const r of inactiveRooms) {
    await queryAsync('UPDATE packages SET package_status = ? WHERE room_id = ?', [packageStatus, r.room_name]);
  }

  if (accom_type === "villa") {
    await queryAsync(
      'UPDATE packages SET package_status = ?, check_in = ?, check_out = ? WHERE package_code2 = ?',
      [packageStatus, checkIn, checkOut, packageCode]
    );
  } else {
    await queryAsync(
      'UPDATE packages SET package_status = ?, check_in = ?, check_out = ? WHERE package_code = ?',
      [packageStatus, checkIn, checkOut, packageCode]
    );
  }
}


//______________________________Refactored Guest Updat____________________________

app.post("/UpdateGuestTable", async (req, res)=>{
  
  const { transaction_id2, guest_status } = req.body;

  //cleaning

        if (guest_status === "CLEANING") {
          try {
            // 1. Update guest_table status
            await queryAsync(
              'UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?',
              [guest_status, transaction_id2]
            );

            // 2. Get the package code from guest_table
            const [guest] = await queryAsync(
              'SELECT * FROM guest_table WHERE transaction_id2 = ?',
              [transaction_id2]
            );
            const package_code = guest.package;

            // 3. Get the accommodation type from packages
            const [packageData] = await queryAsync(
              'SELECT * FROM packages WHERE package_code = ?',
              [package_code]
            );
            const accom_type = packageData.accom_type;

            let package_code_to_use;
            let roomRows;

            if (accom_type === "villa") {
              package_code_to_use = packageData.package_code2;

              roomRows = await queryAsync(
                'SELECT room_id FROM packages WHERE package_code2 = ?',
                [package_code_to_use]
              );
            } else if (accom_type === "room") {
              package_code_to_use = packageData.package_code;

              roomRows = await queryAsync(
                'SELECT room_id FROM packages WHERE package_code = ?',
                [package_code_to_use]
              );
            }

            // 4. Update room status to 'cleaning'
            for (const row of roomRows) {
              await queryAsync(
                'UPDATE rooms SET room_status = ? WHERE room_name = ?',
                ['cleaning', row.room_id]
              );
            }

            // 5. Update packages where rooms are now 'cleaning'
            const inactiveRooms = await queryAsync(
              'SELECT room_name FROM rooms WHERE room_status = ?',
              ['cleaning']
            );

            for (const room of inactiveRooms) {
              await queryAsync(
                'UPDATE packages SET package_status = ? WHERE room_id = ?',
                ['inactive', room.room_name]
              );
            }

            // 6. Re-update villa packages that are inactive
            const inactiveVillas = await queryAsync(
              'SELECT * FROM packages WHERE package_status = ? AND accom_type = ?',
              ['inactive', 'villa']
            );

            for (const villa of inactiveVillas) {
              await queryAsync(
                'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
                ['inactive', villa.package_code2]
              );
            }

            console.log("All updates complete.");
          } catch (err) {
            console.error("Error in CLEANING logic:", err);
          }
      }


      //cleaning]\



      //cancelled


      else if (guest_status === "CANCELLED") {
            try {
              // 1. Update guest_table status
              await queryAsync(
                'UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?',
                [guest_status, transaction_id2]
              );

              // 2. Get the package code from guest_table
              const [guest] = await queryAsync(
                'SELECT * FROM guest_table WHERE transaction_id2 = ?',
                [transaction_id2]
              );
              const package_code = guest.package;

              // 3. Get accommodation type from packages
              const [packageData] = await queryAsync(
                'SELECT * FROM packages WHERE package_code = ?',
                [package_code]
              );
              const accom_type = packageData.accom_type;

              let package_code_to_use;
              let roomRows;

              if (accom_type === "villa") {
                package_code_to_use = packageData.package_code2;

                roomRows = await queryAsync(
                  'SELECT room_id FROM packages WHERE package_code2 = ?',
                  [package_code_to_use]
                );
              } else if (accom_type === "room") {
                package_code_to_use = packageData.package_code;

                roomRows = await queryAsync(
                  'SELECT room_id FROM packages WHERE package_code = ?',
                  [package_code_to_use]
                );
              }

              // 4. Update room status to 'active'
              for (const row of roomRows) {
                await queryAsync(
                  'UPDATE rooms SET room_status = ? WHERE room_name = ?',
                  ['active', row.room_id]
                );
              }

              // 5. Update package status to 'active' where the rooms are active
              const activeRooms = await queryAsync(
                'SELECT room_name FROM rooms WHERE room_status = ?',
                ['active']
              );

              for (const room of activeRooms) {
                await queryAsync(
                  'UPDATE packages SET package_status = ? WHERE room_id = ?',
                  ['active', room.room_name]
                );
              }

              // 6. Re-update active villa packages
              const activeVillas = await queryAsync(
                'SELECT * FROM packages WHERE package_status = ? AND accom_type = ?',
                ['active', 'villa']
              );

              for (const villa of activeVillas) {
                await queryAsync(
                  'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
                  ['active', villa.package_code2]
                );
              }

              console.log("CANCELLATION handling completed.");
            } catch (err) {
              console.error("Error in CANCELLED logic:", err);
            }
}


 //cancelled



 //checkedout



else if (guest_status === "CHECKED_OUT") {
  try {
    // 1. Update guest_table status
    await queryAsync(
      'UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?',
      [guest_status, transaction_id2]
    );

    // 2. Get the guest's package
    const [guest] = await queryAsync(
      'SELECT * FROM guest_table WHERE transaction_id2 = ?',
      [transaction_id2]
    );
    const package_code = guest.package;
    const guest_id = guest.guest_id;
    const current_bill = guest.current_bill;

    // 3. Get package/accommodation type
    const [packageData] = await queryAsync(
      'SELECT * FROM packages WHERE package_code = ?',
      [package_code]
    );
    const accom_type = packageData.accom_type;

    let package_code_to_use;
    let roomRows;

    if (accom_type === "villa") {
      package_code_to_use = packageData.package_code2;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code2 = ?',
        [package_code_to_use]
      );
    } else if (accom_type === "room") {
      package_code_to_use = packageData.package_code;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code = ?',
        [package_code_to_use]
      );
    }

    // 4. Update rooms to active
    for (const row of roomRows) {
      await queryAsync(
        'UPDATE rooms SET room_status = ? WHERE room_name = ?',
        ['active', row.room_id]
      );
    }

    // 5. Update packages based on active rooms
    const activeRooms = await queryAsync(
      'SELECT room_name FROM rooms WHERE room_status = ?',
      ['active']
    );

    for (const room of activeRooms) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE room_id = ?',
        ['active', room.room_name]
      );
    }

    // 6. Re-update villa packages
    const activeVillas = await queryAsync(
      'SELECT * FROM packages WHERE package_status = ? AND accom_type = ?',
      ['active', 'villa']
    );

    for (const villa of activeVillas) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
        ['active', villa.package_code2]
      );
    }

    // 7. Insert billing info
    await queryAsync(
      'UPDATE billing_table set bill = ? where transaction_id2 = ?',
      [current_bill, transaction_id2]
    );

    console.log("CHECKED_OUT process completed.");

    //8. delete from guest table

   // await queryAsync('delete from guest_table where transaction_id2 = ?', [transaction_id2]);
  } catch (err) {
    console.error("Error in CHECKED_OUT logic:", err);
  }
}



 //checkedout


 //checked in

 else if (guest_status === "CHECKED_IN") {
  try {
    // 1. Update guest status
    await queryAsync(
      'UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?',
      [guest_status, transaction_id2]
    );

    // 2. Get guest's package
    const [guest] = await queryAsync(
      'SELECT * FROM guest_table WHERE transaction_id2 = ?',
      [transaction_id2]
    );
    const package_code = guest.package;

    // 3. Get accommodation type
    const [packageData] = await queryAsync(
      'SELECT * FROM packages WHERE package_code = ?',
      [package_code]
    );
    const accom_type = packageData.accom_type;

    let roomRows;
    let package_code_to_use;

    if (accom_type === "villa") {
      package_code_to_use = packageData.package_code2;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code2 = ?',
        [package_code_to_use]
      );
    } else if (accom_type === "room") {
      package_code_to_use = packageData.package_code;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code = ?',
        [package_code_to_use]
      );
    }

    // 4. Set rooms to "occupied"
    for (const row of roomRows) {
      await queryAsync(
        'UPDATE rooms SET room_status = ? WHERE room_name = ?',
        ['occupied', row.room_id]
      );
    }

    // 5. Set packages to "inactive" for all occupied rooms
    const occupiedRooms = await queryAsync(
      'SELECT room_name FROM rooms WHERE room_status = ?',
      ['occupied']
    );

    for (const room of occupiedRooms) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE room_id = ?',
        ['inactive', room.room_name]
      );
    }

    // 6. Update villa packages again if any match
    const inactiveVillas = await queryAsync(
      'SELECT * FROM packages WHERE package_status = ? AND accom_type = ?',
      ['inactive', 'villa']
    );

    for (const villa of inactiveVillas) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
        ['inactive', villa.package_code2]
      );
    }

    console.log("CHECKED_IN process completed.");
  } catch (err) {
    console.error("Error in CHECKED_IN logic:", err);
  }
}



 //checked in


 //confirmed

 else if (guest_status === "CONFIRMED") {
  try {
    // 1. Update guest status
    await queryAsync(
      'UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?',
      [guest_status, transaction_id2]
    );

    // 2. Get guest's package
    const [guest] = await queryAsync(
      'SELECT * FROM guest_table WHERE transaction_id2 = ?',
      [transaction_id2]
    );
    const package_code = guest.package;

    // 3. Get accommodation type
    const [packageData] = await queryAsync(
      'SELECT * FROM packages WHERE package_code = ?',
      [package_code]
    );
    const accom_type = packageData.accom_type;

    let roomRows;
    let package_code_to_use;

    if (accom_type === "villa") {
      package_code_to_use = packageData.package_code2;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code2 = ?',
        [package_code_to_use]
      );
    } else if (accom_type === "room") {
      package_code_to_use = packageData.package_code;

      roomRows = await queryAsync(
        'SELECT room_id FROM packages WHERE package_code = ?',
        [package_code_to_use]
      );
    }

    // 4. Set rooms to "confirmed"
    for (const row of roomRows) {
      await queryAsync(
        'UPDATE rooms SET room_status = ? WHERE room_name = ?',
        ['confirmed', row.room_id]
      );
    }

    // 5. Update packages to "inactive" if any rooms are "occupied"
    const occupiedRooms = await queryAsync(
      'SELECT room_name FROM rooms WHERE room_status = ?',
      ['occupied']
    );

    for (const room of occupiedRooms) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE room_id = ?',
        ['inactive', room.room_name]
      );
    }

    // 6. Reupdate villa packages if needed
    const inactiveVillas = await queryAsync(
      'SELECT * FROM packages WHERE package_status = ? AND accom_type = ?',
      ['inactive', 'villa']
    );

    for (const villa of inactiveVillas) {
      await queryAsync(
        'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
        ['inactive', villa.package_code2]
      );
    }

    console.log("CONFIRMED process completed.");
  } catch (err) {
    console.error("Error in CONFIRMED logic:", err);
  }
}



 //confirmed




 else if (guest_status === "CHECKED_IN" || guest_status === "PENDING") {
  const sql = `UPDATE guest_table SET guest_status = ? WHERE transaction_id2 = ?`;

  connection.query(sql, [guest_status, transaction_id2], (err, results) => {
    if (err) {
      console.error("Error updating guest status:", err);
      return res.status(500).send({ error: "Failed to update guest status" });
    }

    

    
  });
}




res.send({ message: "Guest Updated" });


   


})


  //__________________________________________GUEST UPDATE____________________________________________

  /**/



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

    //get the inputs

    var package = req.body.package;
    var transaction_id2 = req.body.transaction_id2;
    console.log(package);
    console.log(transaction_id2);

    //ready for overstay computation
    
    var date_now_over_stay_time = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
   
    var millis_now = parseInt(new Date(date_now_over_stay_time).getTime());
  
    console.log("Millis of time now")
    console.log(millis_now);

    //get the package info
    
    var sql = `select * from packages where package_code = ?`;
  
    connection.query(sql, [package], (err, results)=>{
  
      console.log(results[0].package_rate);
  
      var package_rate = results[0].package_rate;

      //get the guest table dpeneding on transaction id
  
      var sql_select_guest_table = `select guest_table.* , rate_type.rate_percent, packages.package_rate from guest_table 
                                     inner join packages on packages.package_code = guest_table.package
                                     inner join rate_type on guest_table.rate_no = rate_type.rate_no
                                     where transaction_id2 = ?`;

      //get the adjustment in adjustment history

      var sqlAddAH = `select sum(adjustment_amount) as ADDS from adjustment_history where adjustment_type = ? and transaction_id = ?`
      var sqlMinusAH = `select sum(adjustment_amount) as MINUS from adjustment_history where adjustment_type = ? and transaction_id = ?`

      


      //get the addons table dpeneding on transaction id

      var sumAddons = `select SUM(addons_amount) as totalAddonsTable from addons_table where transaction_id2 = ?`;

      connection.query(sumAddons,[transaction_id2], (err, rows20)=>{

        connection.query(sql_select_guest_table,[transaction_id2], (err2, results_transactionid)=>{

          connection.query(sqlAddAH, ["add", transaction_id2], (err, rows48)=>{



           connection.query(sqlMinusAH, ["minus", transaction_id2], (err, rows49)=>{
            
      

          
            
         
  
          var check_in_datetime = results_transactionid[0].check_in_datetime;
          var length_stay = results_transactionid[0].length_stay;
          var rate_percent = results_transactionid[0].rate_percent;
          var bill2 = parseInt(results_transactionid[0].package_rate) * rate_percent;
          var bill = parseInt(results_transactionid[0].package_rate) + bill2;
          var adjustment_amount = results_transactionid[0].adjustment_amount || 0;
          var adjustment_type = results_transactionid[0].adjustment_type;
          var adjustment_add = rows48[0].ADDS;
          var adjustment_minus = rows49[0].MINUS;
          var check_out_datetime = results_transactionid[0].check_out_datetime;
          
          
          
          var addons_amount = rows20[0].totalAddonsTable;
          
  
          //var new_check_in_datetime = new Date(check_in_datetime).getTime();
  
          console.log("Millis of check in date")
  
          console.log(check_in_datetime);
  
          //var current_stay  = new_check_in_datetime - millis_now;
          var current_stay  = millis_now - parseInt(check_in_datetime);

          var checkInOutMinutes = parseInt(check_out_datetime) - parseInt(check_in_datetime);

          console.log("this is millis in minutes of check in and out")

          console.log(checkInOutMinutes/60000);

          //__________________ON works____________________

          var overStayChargeMinutes = current_stay - checkInOutMinutes;
       

          var overMinutes = (overStayChargeMinutes/60000);

          console.log("over minutes");

          console.log(overMinutes)

        

          var excessInGracePeriod = overMinutes - 15;

          console.log("this is how many 15 minutes are there and less the grace period")

          console.log(excessInGracePeriod);

          var excessCharged = (excessInGracePeriod) * 500

          console.log("Over Stay Charge with rate of 500 pesos")

          console.log(excessCharged);



          //__________________ON works____________________
  
          var current_days = parseInt(current_stay/(1000*60*60*24))
  
          console.log(current_days);
          console.log(typeof(current_days))
          
          //check if the current day is lessthan 0 or current day is equal to zero
          
          if(current_days <= 0){
            var addons = addons_amount || 0;
            var current_bill_raw = parseInt(length_stay) * bill;
            

            console.log("current_bill_raw:", current_bill_raw);
            console.log("addons_amount:", addons);
            console.log("adjustment_amount:", adjustment_amount);
            console.log("bill:", current_bill_raw);
            console.log("length_stay:", length_stay);
            console.log("rate_percent:", rate_percent);
            console.log("type of adjustment amount: ", typeof(adjustment_amount))
            console.log("type of currentbillraw: ", typeof(current_bill_raw))
            console.log("type of addons: ", typeof(addons))

  

              var current_bill = (Number(current_bill_raw) + Number(addons) + Number(adjustment_add)) - Number(adjustment_minus)


            console.log("this is the new bill:", current_bill)

  

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
          }
  
          else if(current_days > 0){
            var addons = addons_amount;
            var current_bill_raw = parseInt(current_days) * bill;
            

              var current_bill = (Number(current_bill_raw) + Number(addons) + Number(adjustment_add)) - Number(adjustment_minus)


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
  
          }
  
         


                  })

              })

             
          })

      });
  
       
    });
  
  });





  

  



   //___________________________________________UPDATE GUEST TABLE________________________________



   //______________________________________UPDATE BILLING TABLE____________________________________
app.post("/UpdateBill2", (req, res)=>{

    const package = req.body.package;
    const transaction_id2 = req.body.transaction_id2;
    console.log(package);
    console.log(transaction_id2);

    var sql_select_guest_table = `select guest_table.* , rate_type.rate_percent, packages.package_rate from guest_table 
                                     inner join packages on packages.package_code = guest_table.package
                                     inner join rate_type on guest_table.rate_no = rate_type.rate_no
                                     where transaction_id2 = ?`;

    var sqlAddAH = `select sum(adjustment_amount) as ADDS from adjustment_history where adjustment_type = ? and transaction_id = ?`;
    var sqlMinusAH = `select sum(adjustment_amount) as MINUS from adjustment_history where adjustment_type = ? and transaction_id = ?`;
    var sumAddons = `select SUM(addons_amount) as totalAddonsTable from addons_table where transaction_id2 = ?`;

    connection.query(sumAddons,[transaction_id2], (err, rows20)=>{

        connection.query(sql_select_guest_table,[transaction_id2], (err2, results_transactionid)=>{

          connection.query(sqlAddAH, ["add", transaction_id2], (err, rows48)=>{



            connection.query(sqlMinusAH, ["minus", transaction_id2], (err, rows49)=>{

          
              var check_in_datetime = results_transactionid[0].check_in_datetime;
              var length_stay = results_transactionid[0].length_stay;
              var rate_percent = results_transactionid[0].rate_percent;
              var bill2 = parseInt(results_transactionid[0].package_rate) * rate_percent;
              var bill = parseInt(results_transactionid[0].package_rate) + bill2;
              var adjustment_amount = results_transactionid[0].adjustment_amount || 0;
              var adjustment_type = results_transactionid[0].adjustment_type;
              var adjustment_add = rows48[0].ADDS;
              var adjustment_minus = rows49[0].MINUS;
              var check_out_datetime = results_transactionid[0].check_out_datetime;
              
            

              });
          });
        });
      });

});

      //______________________________________UPDATE BILLING TABLE____________________________________

   //______________________CALL TO CHANGE THE LIST OF PACKAGE CHECK PACKAGE IF IT IS IN GUEST TABLE______________________________

   app.post("/changePackage", (req, res)=>{

    var pax = req.body.pax;
    var check_in = Date.parse(req.body.check_in);
    var check_out = Date.parse(req.body.check_out);

    console.log([check_in, check_out]);

    if(pax && check_in && check_out){

      var checkGuestTable = `select * from guest_table where check_in_datetime = ? and check_out_datetime = ? and guest_status != "CHECKED_OUT"`;

      connection.query(checkGuestTable, [check_in, check_out], (err, rows23)=>{
      
      

      if(rows23.length > 0){

        var package = rows23[0].package;

                var sqlCheckPackageAccom = `select accom_type, location, package_code2, package_code from packages where package_code = ?`;

                connection.query(sqlCheckPackageAccom, [package], (err, rows24)=>{

                  var accom_type = rows24[0].accom_type;
                  var location = rows24[0].location;

                  if(accom_type == "villa"){

                    if(location == "WHOLE RESORT"){
                       console.log("this is whole resort")
                       return res.send({ package_set: [] })

                    }

                    
                    
                    else{

                              const occupied_rooms = [];
                              const disable_package = [];

                              const select_room = `SELECT room_id FROM packages WHERE package_code2 = ?`;

                              connection.query(select_room, [rows24[0].package_code2], async (err3, rows25) => {
                                if (err3) {
                                  console.error('error running query:', err3);
                                  return;
                                }

                                for (let row of rows25) {
                                  occupied_rooms.push(row.room_id);
                                }

                                try {
                                  // Run queries for each room_id in parallel
                                  const results = await Promise.all(
                                    occupied_rooms.map(room_id => {
                                      return new Promise((resolve, reject) => {
                                        const sqlGetInactivePackage = `SELECT package_code2 FROM packages WHERE room_id = ?`;
                                        connection.query(sqlGetInactivePackage, [room_id], (err5, rows26) => {
                                          if (err5) return reject(err5);
                                          resolve(rows26.map(r => r.package_code2));
                                        });
                                      });
                                    })
                                  );

                                  // Flatten results
                                  results.forEach(r => disable_package.push(...r));

                                  // Now disable_package is ready ✅
                                  const package_code = rows24[0].package_code2;
                                  const sql_select_set_package = `
                                    SELECT DISTINCT package_code, package_name
                                    FROM packages 
                                    WHERE no_of_person <= ? 
                                      AND package_code2 NOT IN (?) group by package_name;
                                  `;

                                  connection.query(sql_select_set_package, [pax, disable_package], (err4, result_set) => {
                                    if (err4) {
                                      console.error('error running query:', err4);
                                      return;
                                    }
                                    res.send({ package_set: result_set });
                                  });

                                } catch (err) {
                                  console.error("error running nested queries:", err);
                                }
                              });


                  

                    }

                  

                  }

             

                     else if(accom_type == "room"){


                              const occupied_rooms = [];
                              const disable_package = [];

                              const select_room = `SELECT room_id FROM packages WHERE package_code = ?`;

                              connection.query(select_room, [rows24[0].package_code], async (err3, rows25) => {
                                if (err3) {
                                  console.error('error running query:', err3);
                                  return;
                                }

                                for (let row of rows25) {
                                  occupied_rooms.push(row.room_id);
                                }

                                try {
                                  // Run queries for each room_id in parallel
                                  const results = await Promise.all(
                                    occupied_rooms.map(room_id => {
                                      return new Promise((resolve, reject) => {
                                        const sqlGetInactivePackage = `SELECT package_code2 FROM packages WHERE room_id = ?`;
                                        connection.query(sqlGetInactivePackage, [room_id], (err5, rows26) => {
                                          if (err5) return reject(err5);
                                          resolve(rows26.map(r => r.package_code2));
                                        });
                                      });
                                    })
                                  );

                                  // Flatten results
                                  results.forEach(r => disable_package.push(...r));

                                  // Now disable_package is ready ✅
                                  const package_code = rows24[0].package_code2;
                                  const sql_select_set_package = `
                                    SELECT DISTINCT package_code, package_name
                                    FROM packages 
                                    WHERE no_of_person <= ? 
                                      AND package_code2 NOT IN (?) group by package_name;
                                  `;

                                  connection.query(sql_select_set_package, [pax, disable_package], (err4, result_set) => {
                                    if (err4) {
                                      console.error('error running query:', err4);
                                      return;
                                    }
                                    res.send({ package_set: result_set });
                                  });

                                } catch (err) {
                                  console.error("error running nested queries:", err);
                                }
                              });

                  }


                });

      }

      else if(rows23.length == 0){
        
          var sql_select_set_package = `select package_code, package_name from packages where no_of_person <= ? group by package_name`;

            connection.query(sql_select_set_package, [pax], (err4, result_set)=>{
              if (err4) {
                console.error('error running query:', err4);
                return;
              }
              res.send({package_set:result_set});

            });
      }

      

      })



    }

    console.log(pax)

    

   });


   //______________________CALL TO CHANGE THE LIST OF PACKAGE CHECK PACKAGE IF IT IS IN GUEST TABLE______________________________


   //__________________________CALL TO CHANGE PRICE BASED ON RATE_______________________

    app.post("/onchangeRate", (req, res)=>{

      var rate_no = req.body.rate_no;

      var sqlSelectRate = `select * from rate_type where rate_no = ?`;

      connection.query(sqlSelectRate, [rate_no], (err, rows19)=>{

        res.send({rateData:rows19})

      });

    });

    //______________________________CALL TO CHANGE PRICE BASED ON RATE_______________________
   

   
   app.post("/onchangePackage", (req, res)=>{

    var package_code = req.body.package_code;
    console.log(package_code);

    var sqlSelectPackage = `select package_rate from packages where package_code = ?`;

    connection.query(sqlSelectPackage, [package_code], (err, rows18)=>{
      res.send({packageCodeData:rows18})
    })

   });



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

    var insertAH = `insert into adjustment_history (adjustment_amount, adjustment_remarks, adjustment_type, transaction_id) values(?,?,?,?)`;

    connection.query(insertAH, [adjustment_amount, adjustment_remarks, adjustment_type, transaction_text], (err, rows28)=>{

      if (err) {
        console.error("Error inserting into adjustment_history:", err);
        console.log({ message: "Insert into adjustment_history failed" });
    }
    console.log("Inserted in adjustment history");

    });



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
  
      if (req.body.adjustment_type =="add"){
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
  
      else if (req.body.adjustment_type == "minus"){
  
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

      const insertInAdjustmentHistory = `insert into adjustment_history (adjustment_amount, adjustment_remarks, adjustment_type, transaction_id) values(?,?,?,?)`;

        connection.query(insertInAdjustmentHistory, [adjustment_amount, adjustment_remarks, adjustment_type, transaction_text], (err, rows28)=>{

      if (err) {
        console.error("Error inserting into adjustment_history:", err);
        console.log({ message: "Insert into adjustment_history failed" });
    }
    console.log("Inserted in adjustment history");

    });
    })
  
  
    //__________________UPDATE GUEST BILL not final_______________________________
  
  //_________________BILLING ADDONS___________________________________

  app.post("/addons", (req, res)=>{
    var addons_remarks = req.body.addons_remarks;
    var addons_amount = req.body.addons_amount;
    var addons_description = req.body.addons_description;
    var transaction_id2 = req.body.transaction_id2;

    var sqlInsertAddons = `insert into addons_table (transaction_id2, addons_amount, addons_remarks, addons_description) values(?, ?, ?, ?)`;
    const sqlUpdateBilling = `update billing_table set bill = bill + ? where transaction_id2 = ?`;

    connection.query(sqlUpdateBilling, [addons_amount, transaction_id2], (err, rows47)=>{

    });

    connection.query(sqlInsertAddons, [transaction_id2, addons_amount, addons_remarks, addons_description], (err, rows17)=>{

      console.log("Addons added")
      res.send({rows:rows17})

    });

  });


  //_________________BILLING ADDONS___________________________________


  //__________________BILLING DISCOUNT_______________________________

  app.post("/discount", (req, res)=>{

    const discount_type = req.body.discount_type;
    const discount_remarks = req.body.discount_remarks;
    const discount_amount = 1.00-.20; //100% - 12%
    const transaction_id2 = req.body.transaction_id2;

    const insertDiscount = `insert into discount_history (discount_amount, discount_type, discount_remarks, transaction_id2) values (?,?,?,?)`;

    connection.query(insertDiscount, [discount_amount, discount_type, discount_remarks, transaction_id2], (err, rows29)=>{

      res.send({message:"Discount Inserted"})

    });

    const selectBillingTableBill = `select bill from billing_table where transaction_id2 = ?`

    connection.query(selectBillingTableBill, [transaction_id2], (err, rows31)=>{
       
     const currentBill =  rows31[0].bill;
     const newBillWithDiscount = currentBill * discount_amount;

     console.log("here is the new bill")

     console.log(newBillWithDiscount);

          //________UPDATE BILL________________

        const sqlUpdateBillingDiscount = `update billing_table set bill = ? where transaction_id2 = ?`;

        connection.query(sqlUpdateBillingDiscount, [newBillWithDiscount, transaction_id2], (err, rows30)=>{

        });



        //________UPDATE BILL________________



    });

   
  });


  //__________________BILLING DISCOUNT_______________________________



  //______________________DELETE PWD, ADDONS AND ADJUSTMENTS___________________________

  app.post("/deleteAddons", (req, res)=>{

    const addons_no = req.body.addons_no;
    const transaction_id2 = req.body.transaction_id2;
    console.log(transaction_id2);

    const sqlSelect  = `select transaction_id2, addons_amount from addons_table where addons_no = ?`;

    connection.query(sqlSelect, [addons_no], (err, rows49)=>{
      var transaction_id2 = rows49[0].transaction_id2
      var addons_amount = rows49[0].addons_amount;

      const sqlUpdateBilling = `update billing_table set bill = bill - ? where transaction_id2 = ?`;

      connection.query(sqlUpdateBilling, [addons_amount, transaction_id2], (err, rows50)=>{

      });


    })

    const deleteAddons = `delete from addons_table where addons_no = ?`;

    connection.query(deleteAddons, [addons_no], (err, rows34)=>{
      res.send({message:addons_no})
    });



  });

  app.post("/deleteDiscount", (req, res)=>{

    const discount_no = req.body.discount_no;

    const sql_get_discount_percent = `select discount_amount, transaction_id2 from discount_history where discount_no = ?`;

    connection.query(sql_get_discount_percent, [discount_no], (err, rows35)=>{

      const percentDiscount = rows35[0].discount_amount;
      const transaction_id2 = rows35[0].transaction_id2;

      console.log(percentDiscount);

      const sqlGetBill = `select bill from billing_table where transaction_id2 = ?`;

      connection.query(sqlGetBill, [transaction_id2], (err, rows36)=>{

        const bill = rows36[0].bill;
        const newBillUpdated = bill/percentDiscount;

        const sqlUpdateBillAgain = `update billing_table set bill = ? where transaction_id2 = ?`;

        connection.query(sqlUpdateBillAgain, [newBillUpdated, transaction_id2], (err, rows37)=>{

          const sqlDeleteDiscount = `delete from discount_history where discount_no = ?`;

          connection.query(sqlDeleteDiscount, [discount_no], (err, rows38)=>{

             res.send({message:transaction_id2});

          })

         

        });

      });

    });

  });


  app.post("/deleteAdjustment", (req, res)=>{

    const adjustment_no = req.body.adjustment_no;

    const sqlRetrieveAdjustment = `select adjustment_amount, transaction_id, adjustment_type from adjustment_history where adjustment_no = ?`;

    connection.query(sqlRetrieveAdjustment, [adjustment_no], (err, rows39)=>{

      const adjustment_amount = rows39[0].adjustment_amount;
      const adjustment_type = rows39[0].adjustment_type;
      const transaction_id2 = rows39[0].transaction_id;

      const sqlBilling = `select bill from billing_table where transaction_id2 = ?`;

      connection.query(sqlBilling, [transaction_id2], (err, rows40)=>{

        let updatedBill;

        
              if (adjustment_type === "add"){


                updatedBill = rows40[0].bill - adjustment_amount;



              }
              

              else if (adjustment_type === "minus"){

                updatedBill = rows40[0].bill + adjustment_amount;

              }

          const updatedBillNow = `update billing_table set bill = ? where transaction_id2 = ?`;

          connection.query(updatedBillNow, [updatedBill, transaction_id2], (err, rows41)=>{

            const deleteAdjustmentHistory = `delete from adjustment_history where adjustment_no = ?`;

            connection.query(deleteAdjustmentHistory, [adjustment_no], (err, rows43)=>{

              res.send({message:transaction_id2});

            });

          });

      })


    });

  });




  //______________________DELETE PWD, ADDONS AND ADJUSTMENTS___________________________



  //________________________VIEWING OF BILLING DETAILS________________________________

  app.post("/viewBillingDetails", (req, res)=>{

    const transaction_id2 = req.body.transaction_id2;

    const retBillingDetails = `select billing_table.*, guest_table.*, packages.package_name from billing_table 
                                inner join guest_table on billing_table.transaction_id2 = guest_table.transaction_id2
                                inner join packages on packages.package_code = guest_table.package where billing_table.transaction_id2 = ?`;

    connection.query(retBillingDetails, [transaction_id2], (err, rows44)=>{

      res.send({full_name:rows44[0].full_name, 
                guest_id:rows44[0].guest_id, 
                transaction_id2:rows44[0].transaction_id2,
                guest_status:rows44[0].guest_status,
                check_in_datetime:rows44[0].check_in_datetime,
                check_out_datetime:rows44[0].check_out_datetime,
                length_stay:rows44[0].length_stay,
                current_bill:rows44[0].bill,
                package_name:rows44[0].package_name
               })

    });

  });


  //________________________VIEWING OF BILLING DETAILS________________________________


  //__________________________VIEW GUEST LIST_________________________________________

  app.get("/guestOnTheList", (req, res)=>{

    const sqlViewGuestDetails = `select * from personal_details_table`;

    connection.query(sqlViewGuestDetails, (err, rows45)=>{
      res.send({details:rows45})

    });

  });




  //__________________________VIEW GUEST LIST_________________________________________



  //___________________________FOR DELETING DATA IN TABLES______________________________

  app.post("/deleteVilla", (req, res)=>{

    const villa_id = req.body.villa_id;

    const sqlDeleteVilla = `delete from villas where villa_id = ?`;

    connection.query(sqlDeleteVilla, [villa_id], (err, rows50)=>{

      res.send({message:villa_id});

    });

  });

    app.post("/deleteRoom", (req, res)=>{

      const room_id = req.body.room_id;
      const sqlDeleteRoom = `delete from rooms where room_id = ?`;

      connection.query(sqlDeleteRoom, [room_id], (err, rows51)=>{

        res.send({message:room_id});

      });

  });

   app.post("/deleteGuest", (req, res)=>{

    const guest_id = req.body.guest_id;
    const sqlDeleteGuest = `delete from personal_details_table where guest_id = ?`;

    connection.query(sqlDeleteGuest, [guest_id], (err, rows55)=>{

      res.send({message:guest_id});

    });

  });

  app.post("/removeReservation", async (req, res)=>{

    const transaction_id2 = req.body.transaction_id2;

    //_______________________UPDATE PACKAGES AND ROOMS_________________

    try{


   const [packageRow] = await queryAsync(`select package from guest_table where transaction_id2 = ?`, [transaction_id2]);


      
    const sqlDeleteReservation = `delete from guest_table where transaction_id2 = ?`;

    await queryAsync(sqlDeleteReservation, [transaction_id2]);
     await updateRoomsAndPackages1(packageRow);

    res.send({message:transaction_id2});

 

    }

    catch (error) {
    console.error("Error in Deleting Booking:", error);
    res.status(500).send("Server error");
  }

    //_______________________UPDATE PACKAGES AND ROOMS_________________


  });


  async function updateRoomsAndPackages1(packageRow) {
  const roomStatus = "Active";
  const packageStatus = "active";
  const [accomType] = await queryAsync(`select * from packages where package_code=?`, [packageRow.package])

  const packageCode = accomType.accom_type === "villa" ? accomType.package_code2 : accomType.package_code;
  const sqlRoom = `SELECT room_id FROM packages WHERE ${accomType.accom_type === "villa" ? "package_code2" : "package_code"} = ?`;
  const rooms = await queryAsync(sqlRoom, [packageCode]);

  for (const room of rooms) {
    await queryAsync('UPDATE rooms SET room_status = ? WHERE room_name = ?', [roomStatus, room.room_id]);
  }

  const inactiveRooms = await queryAsync(
    'SELECT room_name FROM rooms WHERE room_status IN (?, ?)',
    ["Active", "active"]
  );

  for (const r of inactiveRooms) {
    await queryAsync('UPDATE packages SET package_status = ? WHERE room_id = ?', [packageStatus, r.room_name]);
  }

  if (accomType.accom_type === "villa") {
    await queryAsync(
      'UPDATE packages SET package_status = ? WHERE package_code2 = ?',
      [packageStatus, packageCode]
    );
  } else {
    await queryAsync(
      'UPDATE packages SET package_status = ? WHERE package_code = ?',
      [packageStatus,  packageCode]
    );
  }
}

  app.post("/deletePackage", (req, res)=>{
    
    const package_code2 = req.body.package_code2;

    const sqlDeletePackage = `delete from packages where package_code2 = ?`;

    connection.query(sqlDeletePackage, [package_code2], (err, rows52)=>{

      res.send({message:package_code2});

    });

  });

  
  //___________________________FOR DELETING DATA IN TABLES______________________________



  //____________________________Data for printing of billing_____________________________

app.post("/dataForPrintBilling", (req, res) => {
  const transaction_id2 = req.body.transaction_id2;
  console.log(transaction_id2);

  const sqlDataPrintBilling = `
    SELECT 
      guest_table.guest_id,
      guest_table.full_name,
      guest_table.check_in_datetime,
      guest_table.check_out_datetime,
      guest_table.length_stay,
      guest_table.transaction_id2 AS guest_transaction_id2,
      packages.package_name,
      packages.package_rate,
      packages.location,
      billing_table.bill,
      billing_table.basebill,
      billing_table.transaction_id2 AS billing_transaction_id2,
      discount_history.transaction_id2 AS discount_transaction_id2,
      discount_history.discount_amount
    FROM guest_table
    LEFT JOIN billing_table 
      ON guest_table.transaction_id2 = billing_table.transaction_id2
    LEFT JOIN packages 
      ON guest_table.package = packages.package_code
    LEFT JOIN discount_history
      ON discount_history.transaction_id2 = guest_table.transaction_id2
    WHERE guest_table.transaction_id2 = ?;
  `;

  const sqlAdjustment = `SELECT * FROM adjustment_history WHERE transaction_id = ?`;
  const sqlAddons    = `SELECT * FROM addons_table WHERE transaction_id2 = ?`;

  connection.query(sqlDataPrintBilling, [transaction_id2], (err, rows53) => {
    if (err) return res.status(500).send(err);

    connection.query(sqlAdjustment, [transaction_id2], (err2, rows54) => {
      if (err2) return res.status(500).send(err2);

      connection.query(sqlAddons, [transaction_id2], (err3, rows55) => {
        if (err3) return res.status(500).send(err3);

        // ✅ All three results are ready here
        console.log("Data Print:", rows53);
        console.log("Adjustment:", rows54);
        console.log("Addons:", rows55);

        // Render EJS and pass the data
        res.render("modal-billing-print", {
          dataForPrint: rows53,
          breakdownAdjustment: rows54,
          breakdownAddons: rows55
        });
      });
    });
  });
});


   //____________________________Data for printing of billing_____________________________





app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});