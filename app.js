// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const kamarRoutes = require('./routes/kamarRoutes');
const pasienRoutes = require('./routes/pasienRoutes');
const authRoutes = require('./routes/authroutes.js');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

app.set('view engine', 'ejs');

app.use('/', authRoutes);
app.use('/kamar', kamarRoutes);
app.use('/pasien', pasienRoutes);

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
       layout: 'layouts/main-layout',
    });
 });
 
 app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
       layout: 'layouts/main-layout',
    });
 });
 
 app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM kamar', (err, kamar) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            kamar: kamar
        });
 
    });
 });
 
 app.get('/todo', isAuthenticated, (req, res) => {
     db.query('SELECT * FROM pasien', (err, pasien) => {
         if (err) return res.status(500).send('Internal Server Error');
         res.render('pasien', {
             layout: 'layouts/main-layout',
             pasien: pasien
         });
     });
 });

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
