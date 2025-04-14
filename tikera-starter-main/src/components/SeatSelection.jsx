import { useState, useEffect } from 'react';
import { getBookedSeatsForScreening } from '../services/bookingService';

const SeatSelection = ({ 
  showtime, 
  totalTickets, 
  selectedSeats, 
  setSelectedSeats, 
  onComplete, 
  onBack,
  movie 
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [localBookings, setLocalBookings] = useState([]);
  
  useEffect(() => {
    if (showtime && movie) {
      const bookedSeats = getBookedSeatsForScreening(movie.id, showtime.id);
      setLocalBookings(bookedSeats);
    }
  }, [showtime, movie]);
  
  useEffect(() => {
    setSelectedSeats([]);
    setErrorMessage('');
  }, [showtime, setSelectedSeats]);

  if (!showtime || !showtime.room) {
    return <div>No showtime selected</div>;
  }

  const { rows, seatsPerRow } = showtime.room;
  
  const isSeatBooked = (row, seat) => {
    const isApiBooked = showtime.bookings.some(
      booking => booking.row === row && booking.seat === seat
    );
    
    const isLocalBooked = localBookings.some(
      booking => booking.row === row && booking.seat === seat
    );
    
    return isApiBooked || isLocalBooked;
  };

  const isSeatSelected = (row, seat) => {
    return selectedSeats.some(
      selected => selected.row === row && selected.seat === seat
    );
  };

  const handleSeatClick = (row, seat) => {
    if (isSeatBooked(row, seat)) {
      return;
    }

    if (isSeatSelected(row, seat)) {
      setSelectedSeats(selectedSeats.filter(
        s => !(s.row === row && s.seat === seat)
      ));
      setErrorMessage('');
      return;
    }

    if (selectedSeats.length >= totalTickets) {
      setErrorMessage(`You can only select ${totalTickets} seats.`);
      return;
    }

    setSelectedSeats([...selectedSeats, { row, seat }]);
    setErrorMessage('');
  };

  const renderSeats = () => {
    const seatGrid = [];
    
    seatGrid.push(
      <div key="screen" className="flex justify-center mb-10">
        <div className="w-3/4 h-8 bg-gray-300 rounded-t-lg text-center text-xs text-gray-800 font-semibold pt-1 shadow-md">
          SCREEN
        </div>
      </div>
    );
    
    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      
      rowSeats.push(
        <div key={`row-label-${r}`} className="w-6 md:w-8 h-6 md:h-8 flex items-center justify-center text-gray-300 text-xs md:text-sm">
          {r}
        </div>
      );
      
      for (let s = 1; s <= seatsPerRow; s++) {
        const isBooked = isSeatBooked(r, s);
        const isSelected = isSeatSelected(r, s);
        
        rowSeats.push(
          <button
            key={`seat-${r}-${s}`}
            className={`w-6 h-6 md:w-8 md:h-8 m-0.5 md:m-1 rounded-t-md relative group ${
              isBooked 
                ? 'bg-slate-600 cursor-not-allowed' 
                : isSelected
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-white text-slate-800 hover:bg-gray-200'
            } transition-colors`}
            onClick={() => handleSeatClick(r, s)}
            disabled={isBooked}
            title={`Row ${r}, Seat ${s}`}
          >
            <span className="sr-only">Row {r}, Seat {s}</span>
            {/* Seat number indicator */}
            <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-xs">
              {s}
            </span>
            {/* Seat base */}
            <span className={`absolute left-1/2 -bottom-1 w-4/6 h-1 rounded-b-sm transform -translate-x-1/2 ${
              isBooked 
                ? 'bg-slate-700' 
                : isSelected
                  ? 'bg-green-600' 
                  : 'bg-gray-300'
            }`}></span>
          </button>
        );
      }
      
      seatGrid.push(
        <div key={`row-${r}`} className="flex justify-center mb-3">
          {rowSeats}
        </div>
      );
    }
    
    seatGrid.push(
      <div key="legend" className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 text-xs md:text-sm text-white">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white rounded-t-md relative mr-2">
            <span className="absolute left-1/2 -bottom-1 w-4/6 h-1 rounded-b-sm transform -translate-x-1/2 bg-gray-300"></span>
          </div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-t-md relative mr-2">
            <span className="absolute left-1/2 -bottom-1 w-4/6 h-1 rounded-b-sm transform -translate-x-1/2 bg-green-600"></span>
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-slate-600 rounded-t-md relative mr-2">
            <span className="absolute left-1/2 -bottom-1 w-4/6 h-1 rounded-b-sm transform -translate-x-1/2 bg-slate-700"></span>
          </div>
          <span>Taken</span>
        </div>
      </div>
    );
    
    return seatGrid;
  };

  const handleContinue = () => {
    if (selectedSeats.length < totalTickets) {
      setErrorMessage(`Please select ${totalTickets} seats.`);
      return;
    }
    
    onComplete(selectedSeats);
  };

  return (
    <div className="bg-slate-900 p-4 md:p-6 rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-white">Select Your Seats</h2>
      
      <div className="mb-4 md:mb-6 text-center text-gray-300 text-sm md:text-base">
        <p>Please select {totalTickets} seats.</p>
        <p>You have selected {selectedSeats.length} of {totalTickets} seats.</p>
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-2 md:p-3 bg-red-900/50 text-red-200 rounded-md text-center text-sm md:text-base">
          {errorMessage}
        </div>
      )}
      
      <div className="seat-map mb-6 md:mb-8 overflow-x-auto py-2 px-1 bg-slate-950/50 rounded-lg">
        {renderSeats()}
      </div>
      
      <div className="flex justify-between mt-6 md:mt-8">
        <button 
          onClick={onBack}
          className="px-4 md:px-6 py-2 rounded-md border border-slate-600 text-white hover:bg-slate-800 bg-transparent text-sm md:text-base"
        >
          Back
        </button>
        
        <button 
          onClick={handleContinue}
          className={`px-4 md:px-6 py-2 rounded-md text-sm md:text-base ${
            selectedSeats.length === totalTickets
              ? 'bg-white text-slate-900 hover:bg-gray-200' 
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
          disabled={selectedSeats.length !== totalTickets}
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );
};

export default SeatSelection; 