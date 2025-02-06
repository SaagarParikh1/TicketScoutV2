import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, ExternalLink, Tag } from 'lucide-react';
import { searchEvents, Event, EventPrice } from '../services/api';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const results = await searchEvents(query);
        setEvents(results);
        setError('');
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchEvents();
    }
  }, [query]);

  const dates = [...new Set(events.map(event => 
    format(parseISO(event.datetime), 'yyyy-MM-dd')
  ))].sort();

  const filteredEvents = selectedDate
    ? events.filter(event => 
        format(parseISO(event.datetime), 'yyyy-MM-dd') === selectedDate.toISOString().split('T')[0]
      )
    : events;

  const handleDateSelect = (date: string) => {
    setSelectedDate(parseISO(date));
  };

  const getBestDeal = (prices: EventPrice[]) => {
    if (!prices.length) return null;
    return prices.reduce((best, current) => 
      current.lowest < (best?.lowest || Infinity) ? current : best
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      
      {/* Date Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="mr-2" /> Available Dates
        </h2>
        <div className="flex overflow-x-auto pb-4 space-x-2">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedDate && format(selectedDate, 'yyyy-MM-dd') === date
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {format(parseISO(date), 'MMM d, yyyy')}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredEvents.map((event) => {
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
    </div>
  );
};

export default SearchResults;