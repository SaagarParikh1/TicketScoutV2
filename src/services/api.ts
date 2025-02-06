import axios from 'axios';

const SEATGEEK_CLIENT_ID = 'NDgzODEyODN8MTczODgxMzcxMS45NTk4MTU1';
const TICKETMASTER_API_KEY = 'mSGuCzWHHrRqkF2rwPKwPZL4AvPPZ8ST';

export interface Venue {
  name: string;
  city: string;
  state: string;
}

export interface EventPrice {
  lowest: number;
  highest: number;
  source: 'seatgeek' | 'ticketmaster';
  url: string;
}

export interface Event {
  id: string;
  title: string;
  datetime: string;
  venue: Venue;
  prices: EventPrice[];
  image: string;
  url: string;
}

const seatGeekApi = axios.create({
  baseURL: 'https://api.seatgeek.com/2',
  params: {
    client_id: SEATGEEK_CLIENT_ID,
  },
});

const ticketmasterApi = axios.create({
  baseURL: 'https://app.ticketmaster.com/discovery/v2',
  params: {
    apikey: TICKETMASTER_API_KEY,
  },
});

export async function getSuggestions(query: string): Promise<string[]> {
  if (!query) return [];
  
  try {
    const [seatGeekResponse, ticketmasterResponse] = await Promise.allSettled([
      seatGeekApi.get('/events', {
        params: {
          q: query,
          per_page: 5,
        },
      }),
      ticketmasterApi.get('/suggest.json', {
        params: {
          keyword: query,
          size: 5,
        },
      }),
    ]);

    const suggestions = new Set<string>();

    if (seatGeekResponse.status === 'fulfilled') {
      seatGeekResponse.value.data.events.forEach((event: any) => {
        suggestions.add(event.title);
      });
    }

    if (ticketmasterResponse.status === 'fulfilled' && ticketmasterResponse.value.data._embedded?.events) {
      ticketmasterResponse.value.data._embedded.events.forEach((event: any) => {
        suggestions.add(event.name);
      });
    }

    return Array.from(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

async function processEvents(seatGeekEvents: any[], ticketmasterEvents: any[]): Promise<Event[]> {
  const events = new Map<string, Event>();

  // Process SeatGeek events
  for (const event of seatGeekEvents) {
    const eventId = event.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (event.stats?.lowest_price || event.stats?.highest_price) {
      const sgPrice = {
        lowest: event.stats?.lowest_price ?? 0,
        highest: event.stats?.highest_price ?? event.stats?.lowest_price ?? 0,
        source: 'seatgeek' as const,
        url: event.url,
      };

      const existingEvent = events.get(eventId);
      if (existingEvent) {
        existingEvent.prices.push(sgPrice);
      } else {
        events.set(eventId, {
          id: eventId,
          title: event.title,
          datetime: event.datetime_local,
          venue: {
            name: event.venue.name,
            city: event.venue.city,
            state: event.venue.state,
          },
          prices: [sgPrice],
          image: event.performers[0]?.image || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          url: event.url,
        });
      }
    }
  }

  // Process Ticketmaster events
  for (const event of ticketmasterEvents) {
    const eventId = event.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (event.priceRanges?.[0]?.min && event.priceRanges?.[0]?.max) {
      const tmPrice = {
        lowest: event.priceRanges[0].min,
        highest: event.priceRanges[0].max,
        source: 'ticketmaster' as const,
        url: event.url,
      };

      const existingEvent = events.get(eventId);
      if (existingEvent) {
        // Add Ticketmaster price and update image if available
        existingEvent.prices.push(tmPrice);
        if (event.images?.length > 0) {
          existingEvent.image = event.images.find((img: any) => img.ratio === '16_9')?.url || event.images[0]?.url;
        }
      } else {
        events.set(eventId, {
          id: eventId,
          title: event.name,
          datetime: event.dates.start.dateTime,
          venue: {
            name: event._embedded.venues[0].name,
            city: event._embedded.venues[0].city.name,
            state: event._embedded.venues[0].state.stateCode,
          },
          prices: [tmPrice],
          image: event.images.find((img: any) => img.ratio === '16_9')?.url || event.images[0]?.url,
          url: event.url,
        });
      }
    }
  }

  return Array.from(events.values())
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
}

export async function searchEvents(query: string): Promise<Event[]> {
  try {
    const [seatGeekResponse, ticketmasterResponse] = await Promise.allSettled([
      seatGeekApi.get('/events', {
        params: {
          q: query,
          per_page: 50,
        },
      }),
      ticketmasterApi.get('/events.json', {
        params: {
          keyword: query,
          size: 50,
        },
      }),
    ]);

    const seatGeekEvents = seatGeekResponse.status === 'fulfilled' ? seatGeekResponse.value.data.events : [];
    const ticketmasterEvents = ticketmasterResponse.status === 'fulfilled' ? 
      ticketmasterResponse.value.data._embedded?.events || [] : [];

    return processEvents(seatGeekEvents, ticketmasterEvents);
  } catch (error) {
    console.error('Error searching events:', error);
    return [];
  }
}

export async function getTopEvents(): Promise<Event[]> {
  try {
    const [seatGeekResponse, ticketmasterResponse] = await Promise.allSettled([
      seatGeekApi.get('/events', {
        params: {
          per_page: 6,
          sort: 'score.desc',
        },
      }),
      ticketmasterApi.get('/events.json', {
        params: {
          size: 6,
        },
      }),
    ]);

    const seatGeekEvents = seatGeekResponse.status === 'fulfilled' ? seatGeekResponse.value.data.events : [];
    const ticketmasterEvents = ticketmasterResponse.status === 'fulfilled' ? 
      ticketmasterResponse.value.data._embedded?.events || [] : [];

    return processEvents(seatGeekEvents, ticketmasterEvents);
  } catch (error) {
    console.error('Error fetching top events:', error);
    return [];
  }
}