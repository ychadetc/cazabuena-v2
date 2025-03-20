const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
