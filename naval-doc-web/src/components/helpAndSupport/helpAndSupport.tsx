
import React from 'react';

const CallCenter: React.FC = () => {
  const callOptions = [
    {
      title: 'Call Option 1',
      subtitle: 'Customer Support',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Call Option 2',
      subtitle: 'Technical Support',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Call Option 3',
      subtitle: 'General Inquiry',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full bg-blue-800 text-white py-4 flex justify-between items-center px-4">
        <h1 className="text-lg font-semibold">Call Center</h1>
        <div className="flex space-x-4">
          <div className="bg-white rounded-full p-2">
            <img src="/wallet-icon.png" alt="wallet" className="h-6 w-6" />
          </div>
          <div className="bg-white rounded-full p-2">
            <img src="/user-icon.png" alt="user" className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <p className="text-blue-800 font-semibold mt-6 mb-4 text-center">
        Welcome to Welfare Canteen Call Center
      </p>

      {/* Call Options */}
      <div className="w-full max-w-md space-y-4">
        {callOptions.map((option, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-md p-4 ${option.bgColor} text-center cursor-pointer`}
          >
            <h2 className="text-lg font-bold text-blue-900">{option.title}</h2>
            <p className="text-gray-700">{option.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallCenter;
