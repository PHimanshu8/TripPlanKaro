import React, { useState, useEffect } from 'react';
import type { TravelPlan } from '../types';

interface TravelPlanDisplayProps {
  plan: TravelPlan;
}

// FIX: Replaced JSX.Element with React.ReactElement to resolve the namespace error.
const SectionCard: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700 overflow-hidden mb-8">
    <div className="p-5 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
        {icon}
        {title}
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Icons = {
  Destination: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Spots: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Itinerary: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Transport: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M1-1h15v4h-15z" transform="matrix(1 0 0 -1 3 11)" /></svg>,
  Budget: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0 1v.01M4 4h16v16H4V4z" /></svg>,
  Location: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
}

const formatDate = (dateString: string) => {
    // Add T00:00:00 to handle date parsing consistently across timezones
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({ plan }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{plan.destination}</h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{plan.destinationDescription}</p>
        <div className="mt-4 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-semibold px-4 py-1.5 rounded-full">
          Best to visit during: {plan.bestSeasonToVisit}
        </div>
      </div>

      <SectionCard title="Suggested Tourist Spots" icon={<Icons.Spots />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.touristSpots.map((spot, index) => (
            <div key={index} className="relative bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
              {/* <img src={spot.imageUrl} alt={spot.name} className="w-full h-48 object-cover rounded-md mb-4 bg-cover bg-center filter " style={{ backgroundImage: "url('https://marketplace.canva.com/EAF5FxQlSGQ/1/0/1600w/canva-blue-and-white-illustrated-sky-and-airplane-desktop-wallpaper-zYA4XGHAYo0.jpg')" }} /> */}
              <h4 className="font-bold text-gray-800 dark:text-white">{spot.name}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{spot.description}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Icons.Location />
              </a>
            </div>
          ))}
        </div>
      </SectionCard>
      
      <SectionCard title="Daily Itinerary" icon={<Icons.Itinerary />}>
        <div className="space-y-6">
          {plan.dailyItinerary.map((day) => (
            <div key={day.day} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {day.day}
                </div>
                { (day.day < plan.dailyItinerary.length) && <div className="w-px h-full bg-gray-300 dark:bg-gray-600"></div> }
              </div>
              <div className="pb-6 w-full">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{formatDate(day.date)}</p>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mt-1">{day.title}</h4>
                <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                  {day.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Transportation Plan" icon={<Icons.Transport />}>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">From Source to Destination:</h4>
          <div className="space-y-4">
            {plan.transportationPlan.fromSourceToDestination.map((transport, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                <p className="font-bold text-gray-700 dark:text-white">{transport.mode}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{transport.details}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Approximate Budget" icon={<Icons.Budget />}>
        <p className="text-lg text-gray-600 dark:text-gray-300">{plan.approximateBudget}</p>
      </SectionCard>

      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 print:hidden"
        >
          ↑
        </button>
      )}

      <button 
        onClick={handlePrint}
        className="fixed bottom-8 right-24 bg-gray-700 text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 print:hidden"
      >
        ⎙
      </button>

      <style>
        {`
          @media print {
            .print\:hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};
