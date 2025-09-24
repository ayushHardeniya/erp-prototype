import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">EduERP</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">Sign In</button>
            <button className="btn-primary">Get Started</button>
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
    </div>
  );
};

export default LandingPage;