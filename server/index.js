const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'insurance_portal_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Data storage (in production, use a real database)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const usersFile = path.join(dataDir, 'users.json');
const policiesFile = path.join(dataDir, 'policies.json');

// Initialize data files
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}
if (!fs.existsSync(policiesFile)) {
  fs.writeFileSync(policiesFile, JSON.stringify([]));
}

// Helper functions
const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Authentication
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readData(usersFile);
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(usersFile, users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readData(usersFile);
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Motor Insurance Quote
app.post('/api/motor-quote', (req, res) => {
  try {
    const { vehicleType, make, model, year, engineCapacity, location, previousClaims } = req.body;
    
    // Basic premium calculation logic
    let basePremium = 5000;
    
    // Vehicle type adjustments
    const vehicleMultipliers = {
      'car': 1.0,
      'motorcycle': 0.8,
      'truck': 1.5,
      'bus': 2.0
    };
    
    basePremium *= vehicleMultipliers[vehicleType] || 1.0;
    
    // Age adjustment
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(year);
    if (vehicleAge > 10) basePremium *= 1.2;
    else if (vehicleAge > 5) basePremium *= 1.1;
    
    // Engine capacity adjustment
    if (engineCapacity > 2000) basePremium *= 1.3;
    else if (engineCapacity > 1500) basePremium *= 1.1;
    
    // Location adjustment
    const locationMultipliers = {
      'urban': 1.2,
      'suburban': 1.0,
      'rural': 0.9
    };
    
    basePremium *= locationMultipliers[location] || 1.0;
    
    // Previous claims adjustment
    if (previousClaims > 0) {
      basePremium *= (1 + (previousClaims * 0.15));
    } else {
      basePremium *= 0.9; // No claims discount
    }
    
    const quote = {
      id: uuidv4(),
      type: 'motor',
      premium: Math.round(basePremium),
      coverage: {
        thirdParty: 1000000,
        ownDamage: 500000,
        personalAccident: 100000
      },
      details: {
        vehicleType,
        make,
        model,
        year,
        engineCapacity,
        location,
        previousClaims
      },
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error generating quote' });
  }
});

// Health Insurance Quote
app.post('/api/health-quote', (req, res) => {
  try {
    const { age, gender, familyMembers, preExistingConditions, smoker, sumInsured } = req.body;
    
    // Basic premium calculation logic
    let basePremium = parseInt(sumInsured) * 0.03; // 3% of sum insured
    
    // Age adjustment
    if (age > 60) basePremium *= 2.0;
    else if (age > 45) basePremium *= 1.5;
    else if (age > 35) basePremium *= 1.2;
    
    // Family members adjustment
    basePremium *= (1 + (familyMembers * 0.4));
    
    // Pre-existing conditions
    if (preExistingConditions && preExistingConditions.length > 0) {
      basePremium *= (1 + (preExistingConditions.length * 0.25));
    }
    
    // Smoker adjustment
    if (smoker) {
      basePremium *= 1.3;
    }
    
    const quote = {
      id: uuidv4(),
      type: 'health',
      premium: Math.round(basePremium),
      coverage: {
        hospitalization: sumInsured,
        daycare: sumInsured * 0.1,
        preHospitalization: 30,
        postHospitalization: 60
      },
      details: {
        age,
        gender,
        familyMembers,
        preExistingConditions,
        smoker,
        sumInsured
      },
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error generating quote' });
  }
});

// Purchase Policy
app.post('/api/purchase-policy', authenticateToken, (req, res) => {
  try {
    const { quoteId, quote, paymentDetails } = req.body;
    
    const policies = readData(policiesFile);
    
    const policy = {
      id: uuidv4(),
      userId: req.user.id,
      quoteId,
      policyNumber: `INS${Date.now()}`,
      type: quote.type,
      premium: quote.premium,
      coverage: quote.coverage,
      details: quote.details,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      paymentDetails: {
        method: paymentDetails.method,
        transactionId: uuidv4(),
        amount: quote.premium,
        date: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };
    
    policies.push(policy);
    writeData(policiesFile, policies);
    
    res.json({
      message: 'Policy purchased successfully',
      policy
    });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing policy' });
  }
});

// Get User Policies
app.get('/api/my-policies', authenticateToken, (req, res) => {
  try {
    const policies = readData(policiesFile);
    const userPolicies = policies.filter(policy => policy.userId === req.user.id);
    
    res.json(userPolicies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching policies' });
  }
});

// Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const users = readData(usersFile);
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Insurance Portal API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});