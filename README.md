# General Insurance Web Portal

A simple Node.js + Express web portal that lets users buy Motor and Health insurance policies.

## Features

- Quote and buy Motor insurance policies
- Quote and buy Health insurance policies
- Simple in-memory storage for purchased policies (for demo only)
- Built with Express & EJS templating

## Prerequisites

- Node.js (version 16+ recommended)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be running at http://localhost:3000

## Folder Structure

```
.
├── server.js            # Express server
├── package.json         # Project metadata & dependencies
├── views/               # EJS templates
│   ├── index.ejs
│   ├── motor_form.ejs
│   ├── motor_quote.ejs
│   ├── health_form.ejs
│   ├── health_quote.ejs
│   └── purchase_success.ejs
└── public/
    └── styles.css       # Basic styling
```

## Notes

This project is intended as a demonstration only. In a production-ready application you should:

1. Replace dummy premium calculators with real actuarial computations.
2. Add authentication & payment gateway integration.
3. Persist data in a database instead of in-memory arrays.
4. Perform server-side validation & sanitisation of all inputs.
5. Serve the client via HTTPS.

---
&copy; 2024 General Insurance Co.