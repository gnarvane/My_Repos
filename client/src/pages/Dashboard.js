import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Heart, 
  Shield, 
  User, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { getUserPolicies, formatCurrency, formatDate } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('policies');
  const { user } = useAuth();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const userPolicies = await getUserPolicies();
      setPolicies(userPolicies);
    } catch (error) {
      toast.error('Failed to fetch policies');
      console.error('Error fetching policies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPolicyIcon = (type) => {
    return type === 'motor' ? Car : Heart;
  };

  const getPolicyTypeColor = (type) => {
    return type === 'motor' ? 'text-primary-600' : 'text-red-600';
  };

  const motorPolicies = policies.filter(policy => policy.type === 'motor');
  const healthPolicies = policies.filter(policy => policy.type === 'health');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-2">Manage your insurance policies and account settings</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/motor-insurance"
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Motor Policy
              </Link>
              <Link
                to="/health-insurance"
                className="btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Health Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('policies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'policies'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  My Policies ({policies.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'policies' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{policies.length}</div>
                    <div className="text-gray-600">Total Policies</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Car className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{motorPolicies.length}</div>
                    <div className="text-gray-600">Motor Policies</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{healthPolicies.length}</div>
                    <div className="text-gray-600">Health Policies</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies List */}
            {policies.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Policies</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {policies.map((policy) => {
                    const Icon = getPolicyIcon(policy.type);
                    return (
                      <div key={policy.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg ${policy.type === 'motor' ? 'bg-primary-100' : 'bg-red-100'}`}>
                                <Icon className={`h-6 w-6 ${getPolicyTypeColor(policy.type)}`} />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {policy.type === 'motor' ? 'Motor Insurance' : 'Health Insurance'}
                                </h3>
                                <p className="text-sm text-gray-600">Policy #{policy.policyNumber}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
                              {policy.status}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Premium:</span>
                              <span className="font-semibold">{formatCurrency(policy.premium)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Start Date:</span>
                              <span>{formatDate(policy.startDate)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">End Date:</span>
                              <span>{formatDate(policy.endDate)}</span>
                            </div>

                            {policy.type === 'motor' && (
                              <div className="pt-2 border-t">
                                <div className="text-sm text-gray-600">
                                  {policy.details.make} {policy.details.model} ({policy.details.year})
                                </div>
                              </div>
                            )}

                            {policy.type === 'health' && (
                              <div className="pt-2 border-t">
                                <div className="text-sm text-gray-600">
                                  Coverage: {formatCurrency(policy.details.sumInsured)} | 
                                  Members: {policy.details.familyMembers}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 flex space-x-3">
                            <button className="flex-1 bg-primary-50 text-primary-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors">
                              <Eye className="h-4 w-4 inline mr-1" />
                              View Details
                            </button>
                            <button className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                              <Download className="h-4 w-4 inline mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                <p className="text-gray-600 mb-6">You haven't purchased any insurance policies yet. Get started by getting a quote!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/motor-insurance"
                    className="btn-primary"
                  >
                    Get Motor Insurance
                  </Link>
                  <Link
                    to="/health-insurance"
                    className="btn-secondary"
                  >
                    Get Health Insurance
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user?.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user?.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer ID
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user?.id}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Update Profile</span>
                  </button>
                  
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Policy Documents</span>
                  </button>
                  
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Payment History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;