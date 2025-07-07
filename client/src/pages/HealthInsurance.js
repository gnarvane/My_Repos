import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, Shield, CheckCircle, CreditCard, Plus, Minus } from 'lucide-react';
import { getHealthQuote, purchasePolicy, formatCurrency } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const HealthInsurance = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [preExistingConditions, setPreExistingConditions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors }
  } = useForm();

  const watchSmoker = watch('smoker', false);

  const addPreExistingCondition = () => {
    setPreExistingConditions([...preExistingConditions, '']);
  };

  const removePreExistingCondition = (index) => {
    setPreExistingConditions(preExistingConditions.filter((_, i) => i !== index));
  };

  const updatePreExistingCondition = (index, value) => {
    const updated = [...preExistingConditions];
    updated[index] = value;
    setPreExistingConditions(updated);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const quoteData = await getHealthQuote({
        ...data,
        preExistingConditions: preExistingConditions.filter(condition => condition.trim() !== ''),
        smoker: data.smoker === 'true'
      });
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
            <Heart className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Health Insurance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure your health and your family's future with comprehensive medical coverage. Get instant quotes and purchase online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quote Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Quote</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    {...register('age', { 
                      required: 'Age is required',
                      min: { value: 18, message: 'Age must be at least 18' },
                      max: { value: 80, message: 'Age must be less than 80' }
                    })}
                    type="number"
                    placeholder="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Family Members (including self)
                </label>
                <input
                  {...register('familyMembers', { 
                    required: 'Number of family members is required',
                    min: { value: 1, message: 'At least 1 member required' },
                    max: { value: 6, message: 'Maximum 6 members allowed' }
                  })}
                  type="number"
                  placeholder="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.familyMembers && (
                  <p className="mt-1 text-sm text-red-600">{errors.familyMembers.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sum Insured (₹)
                </label>
                <select
                  {...register('sumInsured', { required: 'Sum insured is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select sum insured</option>
                  <option value="300000">₹3,00,000</option>
                  <option value="500000">₹5,00,000</option>
                  <option value="700000">₹7,00,000</option>
                  <option value="1000000">₹10,00,000</option>
                  <option value="1500000">₹15,00,000</option>
                  <option value="2000000">₹20,00,000</option>
                  <option value="2500000">₹25,00,000</option>
                  <option value="5000000">₹50,00,000</option>
                </select>
                {errors.sumInsured && (
                  <p className="mt-1 text-sm text-red-600">{errors.sumInsured.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you a smoker?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      {...register('smoker', { required: 'Please select smoking status' })}
                      type="radio"
                      value="false"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('smoker', { required: 'Please select smoking status' })}
                      type="radio"
                      value="true"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                </div>
                {errors.smoker && (
                  <p className="mt-1 text-sm text-red-600">{errors.smoker.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pre-existing Conditions (if any)
                  </label>
                  <button
                    type="button"
                    onClick={addPreExistingCondition}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Condition
                  </button>
                </div>
                
                {preExistingConditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => updatePreExistingCondition(index, e.target.value)}
                      placeholder="e.g., Diabetes, Hypertension"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removePreExistingCondition(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {preExistingConditions.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Click "Add Condition" to add any pre-existing medical conditions</p>
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
                
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {formatCurrency(quote.premium)}
                    </div>
                    <div className="text-gray-600">Annual Premium</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Coverage Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospitalization:</span>
                      <span className="font-medium">{formatCurrency(quote.coverage.hospitalization)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daycare Procedures:</span>
                      <span className="font-medium">{formatCurrency(quote.coverage.daycare)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pre-Hospitalization:</span>
                      <span className="font-medium">{quote.coverage.preHospitalization} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Post-Hospitalization:</span>
                      <span className="font-medium">{quote.coverage.postHospitalization} days</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Policy Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Age: {quote.details.age} years, {quote.details.gender}</div>
                      <div>Family Members: {quote.details.familyMembers}</div>
                      <div>Sum Insured: {formatCurrency(quote.details.sumInsured)}</div>
                      <div>Smoker: {quote.details.smoker ? 'Yes' : 'No'}</div>
                      {quote.details.preExistingConditions && quote.details.preExistingConditions.length > 0 && (
                        <div>Pre-existing Conditions: {quote.details.preExistingConditions.join(', ')}</div>
                      )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Health Insurance?</h3>
              
              <div className="space-y-3">
                {[
                  'Cashless treatment at 10,000+ network hospitals',
                  'Pre and post hospitalization expenses covered',
                  'Daycare procedures covered',
                  'No waiting period for accidental claims',
                  'Annual health check-ups included',
                  'Mental health coverage available',
                  'Maternity benefits (after waiting period)',
                  'Ambulance charges covered'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="h-5 w-5 text-red-500 mr-3" />
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

export default HealthInsurance;