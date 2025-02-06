import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Clock, Shield, ExternalLink, Tag } from 'lucide-react';
import { getTopEvents, Event, EventPrice } from '../services/api';
import SearchBar from './SearchBar';
import { format, parseISO } from 'date-fns';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopEvents = async () => {
      setLoading(true);
      try {
        const results = await getTopEvents();
        setEvents(results);
        setError('');
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchTopEvents();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const getBestDeal = (prices: EventPrice[]) => {
    if (!prices.length) return null;
    return prices.reduce((best, current) => 
      current.lowest < (best?.lowest || Infinity) ? current : best
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Best Ticket Deals <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compare ticket prices across multiple platforms in real-time. Never miss the best deals for your favorite events.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Ticket Scout?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
              title="Real-time Price Tracking"
              description="Get instant updates on price changes across all major ticket platforms."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600" />}
              title="Price History"
              description="View historical price data to make informed buying decisions."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Verified Sellers"
              description="Only compare prices from trusted and verified ticket sellers."
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trending Events</h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {events.map((event) => {
                const bestDeal = getBestDeal(event.prices);
                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="text-gray-600 mb-4">
                        <p>{format(parseISO(event.datetime), 'MMM d, yyyy h:mm a')}</p>
                        <p>{`${event.venue.city}, ${event.venue.state}`}</p>
                      </div>

                      {/* Best Deal Section */}
                      {bestDeal && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 text-green-600 mr-2" />
                              <span className="font-semibold text-green-800">Best Deal</span>
                            </div>
                            <span className="capitalize text-green-700">{bestDeal.source}</span>
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            ${bestDeal.lowest.toFixed(2)}
                            <a
                              href={bestDeal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-normal ml-2 text-green-600 hover:text-green-800"
                            >
                              Get Tickets <ExternalLink className="h-3 w-3 inline" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* All Prices Section */}
                      <div className="space-y-3">
                        {event.prices.map((price, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="capitalize text-gray-600">{price.source}</span>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                ${price.lowest.toFixed(2)} - ${price.highest.toFixed(2)}
                              </span>
                              <a
                                href={price.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;