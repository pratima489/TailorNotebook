const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Customer = require('./models/Customer');

const app = express();
mongoose.connect('mongodb://localhost:27017/tailor', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Login
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => res.redirect('/customer'));

// Customer Form
let tempData = {};
app.get('/customer', (req, res) => res.render('customer'));
app.post('/customer', (req, res) => {
  tempData = { ...tempData, ...req.body };
  res.redirect('/gender');
});

// Gender
app.get('/gender', (req, res) => res.render('gender'));
app.post('/gender', (req, res) => {
  tempData.gender = req.body.gender;
  res.redirect('/dress');
});

// Dress Type
app.get('/dress', (req, res) => res.render('dress'));
app.post('/dress', (req, res) => {
  tempData.dressType = req.body.dressType;
  res.redirect('/measurements');
});

// Measurements
app.get('/measurements', (req, res) => res.render('measurements'));
app.post('/measurements', (req, res) => {
  tempData.measurements = req.body;
  res.redirect('/payment');
});

// Payment
app.get('/payment', (req, res) => res.render('payment'));
app.post('/payment', async (req, res) => {
  tempData.payment = req.body;
  const customer = new Customer(tempData);
  await customer.save();
  res.redirect('/order');
});

// Confirmation
app.get('/order', async (req, res) => {
  const lastCustomer = await Customer.findOne().sort({ _id: -1 });
  res.render('order', { customer: lastCustomer });
});

// View All Customers
app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.render('customers', { customers });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
