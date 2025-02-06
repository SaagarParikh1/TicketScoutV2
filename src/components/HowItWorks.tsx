import React from 'react';
import { Search, TrendingUp, DollarSign, Bell, Ticket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How Ticket Scout Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the best ticket deals across multiple platforms in just a few simple steps.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <StepCard
            icon={<Search className="h-8 w-8 text-blue-600" />}
            step="1"
            title="Search Events"
            description="Enter the name of your favorite artist, team, or event to start your search."
          />
          <StepCard
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
            step="2"
            title="Compare Prices"
            description="We instantly compare prices across Ticketmaster, SeatGeek, and more to find you the best deals."
          />
          <StepCard
            icon={<Ticket className="h-8 w-8 text-blue-600" />}
            step="3"
            title="Get Your Tickets"
            description="Purchase directly from your preferred vendor with confidence."
          />
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
              title="Best Price Guarantee"
              description="We compare prices across multiple platforms to ensure you get the best deal available."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6 text-blue-600" />}
              title="Price Drop Alerts"
              description="Set up alerts and get notified when ticket prices drop for your favorite events."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              title="Price History"
              description="View historical price data to make informed buying decisions."
            />
            <FeatureCard
              icon={<Ticket className="h-6 w-6 text-indigo-600" />}
              title="Verified Sellers"
              description="All tickets come from trusted and verified ticket sellers."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Find Your Next Event?
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon, step, title, description }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {step}
      </div>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;