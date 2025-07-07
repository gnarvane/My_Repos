import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Car, Shield, CheckCircle, CreditCard } from 'lucide-react';
import { getMotorQuote, purchasePolicy, formatCurrency } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MotorInsurance = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const quoteData = await getMotorQuote(data);
      setQuote(quoteData);
      toast.success('Quote generated successfully!');
    } catch (error) {
      toast.error('Failed to generate quote. Please try again.');
      console.error('Quote error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast.error('Please login to purchase a policy');
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  const onPaymentSubmit = async (paymentData) => {
    setIsPurchasing(true);
    try {
      const policyData = {
        quoteId: quote.id,
        quote: quote,
        paymentDetails: paymentData
      };
      
      const result = await purchasePolicy(policyData);
      toast.success('Policy purchased successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to purchase policy. Please try again.');
      console.error('Purchase error:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Car className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Motor Insurance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protect your vehicle with comprehensive coverage. Get instant quotes and secure your policy online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quote Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Quote</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                </select>
                {errors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    {...register('make', { required: 'Make is required' })}
                    type="text"
                    placeholder="e.g., Honda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.make && (
                    <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    {...register('model', { required: 'Model is required' })}
                    type="text"
                    placeholder="e.g., City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Manufacture
                  </label>
                  <input
                    {...register('year', { 
                      required: 'Year is required',
                      min: { value: 1990, message: 'Year must be 1990 or later' },
                      max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                    })}
                    type="number"
                    placeholder="2020"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engine Capacity (CC)
                  </label>
                  <input
                    {...register('engineCapacity', { 
                      required: 'Engine capacity is required',
                      min: { value: 100, message: 'Engine capacity must be at least 100cc' }
                    })}
                    type="number"
                    placeholder="1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.engineCapacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.engineCapacity.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select location</option>
                  <option value="urban">Urban</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural</option>
                </select>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Claims (Last 3 Years)
                </label>
                <input
                  {...register('previousClaims', { 
                    required: 'Previous claims information is required',
                    min: { value: 0, message: 'Claims cannot be negative' }
                  })}
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.previousClaims && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousClaims.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Quote...
                  </div>
                ) : (
                  'Get Quote'
                )}
              </button>
            </form>
          </div>

          {/* Quote Display */}
          <div className="space-y-6">
            {quote && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Quote</h2>
                
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {formatCurrency(quote.premium)}
                    </div>
                    <div className="text-gray-600">Annual Premium</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Coverage Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Third Party Coverage:</span>
                      <span className="font-medium">{formatCurrency(quote.coverage.thirdParty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Own Damage:</span>
                      <span className="font-medium">{formatCurrency(quote.coverage.ownDamage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Personal Accident:</span>
                      <span className="font-medium">{formatCurrency(quote.coverage.personalAccident)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Vehicle Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{quote.details.make} {quote.details.model} ({quote.details.year})</div>
                      <div>{quote.details.engineCapacity}cc, {quote.details.vehicleType}</div>
                      <div>Location: {quote.details.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Quote valid until {new Date(quote.validUntil).toLocaleDateString()}
                  </div>
                </div>

                {!showPayment ? (
                  <button
                    onClick={handlePurchase}
                    className="w-full btn-primary mt-6"
                  >
                    Purchase Policy
                  </button>
                ) : (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                    
                    <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          {...registerPayment('method', { required: 'Payment method is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select payment method</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="debit_card">Debit Card</option>
                          <option value="net_banking">Net Banking</option>
                          <option value="upi">UPI</option>
                        </select>
                        {paymentErrors.method && (
                          <p className="mt-1 text-sm text-red-600">{paymentErrors.method.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setShowPayment(false)}
                          className="btn-secondary"
                        >
                          Back to Quote
                        </button>
                        <button
                          type="submit"
                          disabled={isPurchasing}
                          className="btn-primary"
                        >
                          {isPurchasing ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Pay {formatCurrency(quote.premium)}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Motor Insurance?</h3>
              
              <div className="space-y-3">
                {[
                  'Comprehensive coverage for third-party and own damage',
                  '24/7 roadside assistance',
                  'Cashless repairs at network garages',
                  'Quick claim settlement',
                  'Personal accident cover included',
                  'Zero depreciation add-on available'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorInsurance;