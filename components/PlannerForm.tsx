import React from 'react';
// FIX: Changed import to directly use TravelBudget for better clarity and type safety.
import type { TravelBudget } from '../types';

interface PlannerFormProps {
  onSubmit: () => void;
  isLoading: boolean;
  source: string;
  setSource: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  budget: TravelBudget;
  setBudget: (value: TravelBudget) => void;
}

const InputField: React.FC<{label: string, id: string, children: React.ReactNode}> = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

export const PlannerForm: React.FC<PlannerFormProps> = ({ 
    onSubmit, 
    isLoading,
    source,
    setSource,
    destination,
    setDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    budget,
    setBudget 
}) => {

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (new Date(newStartDate) > new Date(endDate)) {
        setEndDate(newStartDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && startDate && endDate && new Date(endDate) >= new Date(startDate)) {
      onSubmit();
    } else {
        alert("Please fill in the source location and select a valid start and end date.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          <InputField label="From (Source)" id="source">
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Bengaluru, Hyderabad, Chennai"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </InputField>

          <InputField label="Start Date" id="startDate">
              <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
          </InputField>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InputField label="To (Destination - Optional)" id="destination">
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Suggest one for me!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </InputField>

          <InputField label="End Date" id="endDate">
              <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
          </InputField>
        </div>
        
        {/* Bottom Row */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2">
            <InputField label="Budget" id="budget">
            <select
                id="budget"
                value={budget}
                // FIX: Used specific type assertion for better type safety.
                onChange={(e) => setBudget(e.target.value as TravelBudget)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
                <option>Budget-Friendly</option>
                <option>Moderate</option>
                <option>Luxury</option>
            </select>
            </InputField>

            <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white font-bold py-2.5 px-4 rounded-full hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : (
                'Generate Plan'
            )}
            </button>
        </div>
      </form>
    </div>
  );
};