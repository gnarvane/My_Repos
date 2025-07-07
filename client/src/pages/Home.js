import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Heart, Shield, CheckCircle, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Comprehensive Coverage',
      description: 'Get complete protection with our wide range of insurance products tailored to your needs.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support from our experienced insurance professionals to guide you every step.'
    },
    {
      icon: TrendingUp,
      title: 'Best Rates',
      description: 'Competitive premiums and flexible payment options to fit your budget and requirements.'
    },
    {
      icon: CheckCircle,
      title: 'Quick Claims',
      description: 'Fast and hassle-free claim processing with digital documentation and instant approvals.'
    }
  ];

  const products = [
    {
      icon: Car,
      title: 'Motor Insurance',
      description: 'Comprehensive coverage for your vehicle including third-party, own damage, and personal accident protection.',
      features: ['Third Party Coverage', 'Own Damage Protection', 'Personal Accident Cover', 'Roadside Assistance'],
      link: '/motor-insurance'
    },
    {
      icon: Heart,
      title: 'Health Insurance',
      description: 'Complete health protection for you and your family with extensive hospital network coverage.',
      features: ['Hospitalization Coverage', 'Pre & Post Hospitalization', 'Daycare Procedures', 'Family Floater Option'],
      link: '/health-insurance'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Life,
                <span className="text-yellow-300"> Protected</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Secure your future with comprehensive insurance solutions. Get instant quotes, 
                compare plans, and purchase policies online in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/motor-insurance"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Get Motor Quote
                </Link>
                <Link
                  to="/health-insurance"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
                >
                  Get Health Quote
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-96 h-96 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <Shield className="w-48 h-48 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureLife?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the best insurance experience through 
              innovative technology and personalized service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Insurance Products
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage options designed to protect what matters most to you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4">
                      <product.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{product.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-secondary-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={product.link}
                    className="btn-primary w-full text-center block"
                  >
                    Get Quote Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SecureLife for their insurance needs. 
            Get your personalized quote in just a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/motor-insurance"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors"
            >
              Get Quick Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;