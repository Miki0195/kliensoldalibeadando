import { useState, useEffect } from 'react';

const TICKET_PRICES = {
  adult: 2500,
  student: 2000,
  senior: 1800
};

const TicketSelection = ({ ticketSelection, onComplete, onBack }) => {
  const [tickets, setTickets] = useState({
    adult: 0,
    student: 0,
    senior: 0
  });
  
  useEffect(() => {
    if (ticketSelection) {
      setTickets(ticketSelection);
    }
  }, [ticketSelection]);

  const handleChange = (type, value) => {
    const newValue = Math.max(0, value);
    setTickets(prev => ({
      ...prev,
      [type]: newValue
    }));
  };

  const getTotalTickets = () => {
    return tickets.adult + tickets.student + tickets.senior;
  };

  const getTotalPrice = () => {
    return (
      tickets.adult * TICKET_PRICES.adult +
      tickets.student * TICKET_PRICES.student +
      tickets.senior * TICKET_PRICES.senior
    );
  };

  const handleContinue = () => {
    if (getTotalTickets() > 0) {
      onComplete(tickets);
    } else {
      alert('Please select at least one ticket.');
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Select Tickets</h2>
      
      <div className="space-y-6">
        <div className="ticket-type-row grid grid-cols-3 items-center gap-4 p-3 rounded bg-slate-800 border border-slate-700">
          <div>
            <h3 className="font-semibold">Adult</h3>
            <p className="text-sm text-gray-300">{TICKET_PRICES.adult} Ft</p>
          </div>
          
          <div className="flex items-center justify-end col-span-2">
            <button 
              className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
              onClick={() => handleChange('adult', tickets.adult - 1)}
            >
              -
            </button>
            
            <span className="w-8 text-center mx-2">{tickets.adult}</span>
            
            <button 
              className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
              onClick={() => handleChange('adult', tickets.adult + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="ticket-type-row grid grid-cols-3 items-center gap-4 p-3 rounded bg-slate-800 border border-slate-700">
          <div>
            <h3 className="font-semibold">Student</h3>
            <p className="text-sm text-gray-300">{TICKET_PRICES.student} Ft</p>
          </div>
          
          <div className="flex items-center justify-end col-span-2">
            <button 
              className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
              onClick={() => handleChange('student', tickets.student - 1)}
            >
              -
            </button>
            
            <span className="w-8 text-center mx-2">{tickets.student}</span>
            
            <button 
              className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
              onClick={() => handleChange('student', tickets.student + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="ticket-type-row grid grid-cols-3 items-center gap-4 p-3 rounded bg-slate-800 border border-slate-700">
          <div>
            <h3 className="font-semibold">Senior</h3>
            <p className="text-sm text-gray-300">{TICKET_PRICES.senior} Ft</p>
          </div>
          
          <div className="flex items-center justify-end col-span-2">
            <button 
              className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
              onClick={() => handleChange('senior', tickets.senior - 1)}
            >
              -
            </button>
            
            <span className="w-8 text-center mx-2">{tickets.senior}</span>
            
            <button 
              className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
              onClick={() => handleChange('senior', tickets.senior + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-slate-700 pt-6">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total Tickets:</span>
          <span>{getTotalTickets()}</span>
        </div>
        
        <div className="flex justify-between text-xl font-bold">
          <span>Total Price:</span>
          <span>{getTotalPrice()} Ft</span>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-2 rounded-md border border-slate-600 text-white hover:bg-slate-800 bg-transparent"
        >
          Back
        </button>
        
        <button 
          onClick={handleContinue}
          className="px-6 py-2 rounded-md bg-white text-slate-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={getTotalTickets() === 0}
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default TicketSelection; 