
import React from 'react';

interface DestinationSuggestionsProps {
  source: string;
  onSelectDestination: (destination: string) => void;
}



export const DestinationSuggestions: React.FC<DestinationSuggestionsProps> = ({ source, onSelectDestination }) => {
  const popularDestinations =  [
    { name: 'Goa, India', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/3e/36/95/baga-sea-beach.jpg?w=800&h=-1&s=1' },
    { name: 'Jaipur, India', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/500px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' },
    { name: 'Kerala, India', image: 'https://img.traveltriangle.com/blog/wp-content/uploads/2023/02/Kerala-Cover-1.jpg' },
  ];

  // const handleClear = () => {
  //   onSelectDestination('');
  // };

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        Need inspiration? Try one of these popular destinations:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {popularDestinations.map(dest => (
          <button
            key={dest.name}
            onClick={() => onSelectDestination(dest.name)}
            className="relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <img src={dest.image} alt={dest.name} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h4 className="text-white text-lg font-bold">{dest.name}</h4>
            </div>
          </button>
        ))}
      </div>
      {/* <button
        onClick={handleClear}
        className="mt-4 px-4 py-1.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
      >
        Clear
      </button> */}
    </div>
  );
};
