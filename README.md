# 🛡️ SecureLife Insurance Portal

A comprehensive web portal for general insurance company offering motor and health insurance policies. Built with React.js frontend and Node.js backend.

## ✨ Features

### 🏠 **Home Page**
- Modern, responsive design with hero section
- Insurance product highlights
- Feature showcases and company information

### 🔐 **Authentication System**
- User registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Secure password handling with bcrypt

### 🚗 **Motor Insurance**
- Interactive quote form with vehicle details
- Real-time premium calculation based on:
  - Vehicle type, make, model, year
  - Engine capacity and location
  - Previous claims history
- Comprehensive coverage options
- Instant quote generation

### 🏥 **Health Insurance**
- Detailed health information form
- Premium calculation considering:
  - Age, gender, family size
  - Sum insured amount
  - Smoking status
  - Pre-existing conditions
- Multiple coverage options
- Family floater policies

### 💳 **Policy Purchase**
- Secure online payment simulation
- Multiple payment methods (Credit/Debit Card, UPI, Net Banking)
- Policy document generation
- Transaction tracking

### 📊 **User Dashboard**
- Personal policy management
- Policy details and documents
- Profile management
- Quick access to new quotes

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18.2.0) - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Database
- **JSON Files** - Simple file-based storage (easily upgradeable to PostgreSQL/MongoDB)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd insurance-portal
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

3. **Start the application**
```bash
# Start both server and client concurrently
npm run dev

# Or start individually:
# Backend (runs on http://localhost:5000)
npm run server

# Frontend (runs on http://localhost:3000)
npm run client
```

4. **Open your browser**
Navigate to `http://localhost:3000` to view the application.

## 📁 Project Structure

```
insurance-portal/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── MotorInsurance.js
│   │   │   ├── HealthInsurance.js
│   │   │   └── Dashboard.js
│   │   ├── context/       # React context
│   │   │   └── AuthContext.js
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── data/             # JSON data storage
│   │   ├── users.json    # User data
│   │   └── policies.json # Policy data
│   ├── index.js          # Express server
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Insurance Quotes
- `POST /api/motor-quote` - Generate motor insurance quote
- `POST /api/health-quote` - Generate health insurance quote

### Policy Management
- `POST /api/purchase-policy` - Purchase insurance policy (protected)
- `GET /api/my-policies` - Get user policies (protected)

### Health Check
- `GET /api/health` - API health check

## 💡 Usage Guide

### 1. **Getting Started**
- Visit the home page to learn about insurance products
- Click "Get Quote" on motor or health insurance cards

### 2. **Motor Insurance Quote**
- Fill in vehicle details (type, make, model, year)
- Enter engine capacity and location
- Specify previous claims history
- Get instant premium calculation

### 3. **Health Insurance Quote**
- Enter personal details (age, gender)
- Specify family members count
- Choose sum insured amount
- Add pre-existing conditions if any
- Specify smoking status

### 4. **Policy Purchase**
- Review quote details and coverage
- Register/Login to proceed with purchase
- Select payment method
- Complete purchase and get policy number

### 5. **Dashboard Management**
- View all purchased policies
- Download policy documents
- Manage profile information
- Get new quotes quickly

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional design
- **Interactive Forms** - Real-time validation and feedback
- **Loading States** - Smooth user experience during API calls
- **Toast Notifications** - Success and error messages
- **Protected Routes** - Secure access to user data

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Client and server-side validation
- **Protected API Routes** - Authentication middleware
- **CORS Configuration** - Cross-origin request security

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
npm start
```

### Environment Variables
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

## 🔧 Customization

### Adding New Insurance Types
1. Create new API endpoints in `server/index.js`
2. Add quote calculation logic
3. Create frontend form component
4. Update navigation and routing

### Database Integration
Replace JSON file storage with:
- **PostgreSQL** for relational data
- **MongoDB** for document storage
- **MySQL** for traditional SQL needs

### Payment Gateway Integration
Integrate with:
- **Stripe** for international payments
- **Razorpay** for Indian market
- **PayPal** for global transactions

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Kill process on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
```

2. **Dependencies not found**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Build errors**
```bash
# Check Node.js version
node --version
# Ensure compatibility with package.json engines
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@securelife.com
- Phone: 1800-123-4567
- Create an issue in the repository

## 🙏 Acknowledgments

- Design inspiration from modern insurance platforms
- Icons by Lucide React
- UI components styled with Tailwind CSS
- Authentication patterns from JWT best practices

---

**SecureLife Insurance Portal** - Protecting what matters most to you! 🛡️