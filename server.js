const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure templating and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for purchased policies (demo purpose only)
const purchases = [];

/************************
 * PUBLIC ROUTES         *
 ************************/
app.get('/', (req, res) => {
  res.render('index');
});

/* ------------ Motor Insurance ------------ */
app.get('/motor', (req, res) => {
  res.render('motor_form');
});

app.post('/motor/quote', (req, res) => {
  const { vehicleType, make, model, year, coverType } = req.body;

  const basePremium = 5000; // base INR
  let premium = basePremium;

  if (coverType === 'comprehensive') {
    premium += 2000; // extra for comprehensive cover
  }

  const vehicleAge = new Date().getFullYear() - parseInt(year, 10);
  premium += vehicleAge * 100; // increase for each year old

  res.render('motor_quote', { premium, data: req.body });
});

app.post('/motor/buy', (req, res) => {
  purchases.push({ product: 'motor', details: req.body });
  res.render('purchase_success', { policyType: 'Motor Insurance' });
});

/* ------------ Health Insurance ------------ */
app.get('/health', (req, res) => {
  res.render('health_form');
});

app.post('/health/quote', (req, res) => {
  const { age, members, sumInsured } = req.body;

  let premium = parseInt(sumInsured, 10) / 100; // base factor on SI
  premium += parseInt(members, 10) * 500; // Rs.500 per member
  premium += parseInt(age, 10) * 20; // Rs.20 per year of age

  res.render('health_quote', { premium, data: req.body });
});

app.post('/health/buy', (req, res) => {
  purchases.push({ product: 'health', details: req.body });
  res.render('purchase_success', { policyType: 'Health Insurance' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});