import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Motor insurance quote
export const getMotorQuote = async (formData) => {
  const response = await axios.post('/api/motor-quote', formData);
  return response.data;
};

// Health insurance quote
export const getHealthQuote = async (formData) => {
  const response = await axios.post('/api/health-quote', formData);
  return response.data;
};

// Purchase policy
export const purchasePolicy = async (policyData) => {
  const response = await axios.post('/api/purchase-policy', policyData);
  return response.data;
};

// Get user policies
export const getUserPolicies = async () => {
  const response = await axios.get('/api/my-policies');
  return response.data;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};