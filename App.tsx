import React, { useState, useCallback, useEffect } from 'react';
import { PlannerForm } from './components/PlannerForm';
import { TravelPlanDisplay } from './components/TravelPlanDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { DestinationSuggestions } from './components/DestinationSuggestions';
import { ThemeToggle } from './components/ThemeToggle';
import { generateTravelPlan } from './services/geminiService';
import type { TravelPlan, TravelBudget } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  
  // Set default dates to next month to provide a better UX
  const defaultStartDate = new Date();
  const defaultEndDate = new Date(defaultStartDate);
  defaultEndDate.setDate(defaultEndDate.getDate() + 6);
  
  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(formatDateForInput(defaultStartDate));
  const [endDate, setEndDate] = useState<string>(formatDateForInput(defaultEndDate));
  const [budget, setBudget] = useState<TravelBudget>('Moderate');

  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTravelPlan(null);

    try {
      const plan = await generateTravelPlan({
        source,
        destination,
        startDate,
        endDate,
        budget,
      });
      setTravelPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [source, destination, startDate, endDate, budget]);

  // bg-cover bg-center filter blur-sm" style={{ backgroundImage: "url('https://assets.insuremytrip.com/wp-content/uploads/2024/12/06160852/hero-image_1440x400_travel-tips.jpg')" }}
  return (
    <div className={`min-h-screen font-sans ${theme === 'light' ? 'bg-gray-500' : 'bg-gray-900'}`}>
      <header className="bg-gray dark:bg-gray-800 shadow-sm sticky top-0 z-10 rounded-bl-full rounded-br-full border-b border-gray-200 dark:border-gray-700 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center ">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ml-20  ">
              TripPlanKaro
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 ml-20">No worries anymore, let AI  plan the trip</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="max-w-4xl mx-auto">
          <PlannerForm 
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
            source={source}
            setSource={setSource}
            destination={destination}
            setDestination={setDestination}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            budget={budget}
            setBudget={setBudget}
          />

          <DestinationSuggestions onSelectDestination={setDestination} source={source} />

          <div className="mt-10">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {travelPlan && <TravelPlanDisplay plan={travelPlan} theme={theme} />}
          </div>
        </div>
      </main>

      {/* <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer> */}
    </div>
  );
};

export default App;