import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/supabase';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await auth.signIn({ email, password });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">EduERP</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowLoginForm(true)} 
              className="px-4 py-2 rounded border border-primary-500 text-primary-600 hover:bg-primary-50"
            >
              Sign In
            </button>
            <button className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Next-Generation Education Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              A comprehensive ERP solution designed for modern educational institutions
            </p>
            <button className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards will go here */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Student Management</h3>
              <p className="text-gray-600">
                Comprehensive student profiles, attendance tracking, and performance analytics
              </p>
            </div>
            {/* Add more feature cards */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Footer content will go here */}
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <p className="text-gray-400">
                Building the future of education management
              </p>
            </div>
            {/* Add more footer sections */}
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sign In</h2>
              <button 
                onClick={() => setShowLoginForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;