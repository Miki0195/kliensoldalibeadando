import React from 'react';
import { addBooking } from '../services/bookingService';

const TICKET_PRICES = {
  adult: 2500,
  student: 2000,
  senior: 1800
};

const BookingSummary = ({ 
  movie, 
  selectedDay, 
  showtime, 
  ticketSelection, 
  selectedSeats, 
  onConfirm, 
  onBack,
  showPopup,
  setShowPopup
}) => {
  if (!movie || !showtime || !ticketSelection) {
    return <div>Missing booking information</div>;
  }

  const formatSeats = () => {
    const sortedSeats = [...selectedSeats].sort((a, b) => {
      if (a.row === b.row) {
        return a.seat - b.seat;
      }
      return a.row - b.row;
    });
    
    const seatsByRow = {};
    sortedSeats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat.seat);
    });
    
    return Object.entries(seatsByRow).map(([row, seats]) => {
      return `${row}. row ${seats.map(seat => `${seat}. seat`).join(', ')}`;
    }).join(', ');
  };

  const calculateTotalPrice = () => {
    return (
      ticketSelection.adult * TICKET_PRICES.adult +
      ticketSelection.student * TICKET_PRICES.student +
      ticketSelection.senior * TICKET_PRICES.senior
    );
  };

  const handleConfirmBooking = () => { 
    const success = addBooking(
      movie.id,
      showtime.id,
      selectedSeats,
      ticketSelection
    );
    
    if (success) {
      onConfirm();
    } else {
      alert('There was an error saving your booking. Please try again.');
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
      
      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-36 flex-shrink-0 overflow-hidden rounded border border-slate-700">
            <img 
              src={`/assets/images/${movie.image}`} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-bold">{movie.title}</h3>
            <p className="text-gray-300">{selectedDay}</p>
            <p className="text-gray-300">{showtime.start_time}</p>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-md space-y-4 border border-slate-700">
          <div className="grid grid-cols-2">
            <div className="text-gray-300">Tickets:</div>
            <div>
              {ticketSelection.adult > 0 && (
                <div className="flex justify-between">
                  <span>{ticketSelection.adult} x Adult</span>
                  <span>{ticketSelection.adult * TICKET_PRICES.adult} Ft</span>
                </div>
              )}
              
              {ticketSelection.student > 0 && (
                <div className="flex justify-between">
                  <span>{ticketSelection.student} x Student</span>
                  <span>{ticketSelection.student * TICKET_PRICES.student} Ft</span>
                </div>
              )}
              
              {ticketSelection.senior > 0 && (
                <div className="flex justify-between">
                  <span>{ticketSelection.senior} x Senior</span>
                  <span>{ticketSelection.senior * TICKET_PRICES.senior} Ft</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="text-gray-300">Seats:</div>
            <div>{formatSeats()}</div>
          </div>
          
          <div className="grid grid-cols-2 text-lg font-bold pt-4 border-t border-slate-600">
            <div>Total:</div>
            <div>{calculateTotalPrice()} Ft</div>
          </div>
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
          onClick={handleConfirmBooking}
          className="px-6 py-2 rounded-md bg-white text-slate-900 hover:bg-gray-200"
        >
          Confirm Booking
        </button>
      </div>
      
      {/* Popup Summary */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-6 rounded-lg max-w-lg w-full border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">{movie.title}</h2>
            <h3 className="text-xl mb-4">{selectedDay}</h3>
            
            <div className="bg-slate-800 p-4 rounded-md mb-6 border border-slate-700">
              <div className="grid grid-cols-2 gap-y-3">
                {ticketSelection.adult > 0 && (
                  <>
                    <div className="text-gray-300">{ticketSelection.adult}x Adult</div>
                    <div className="text-right">{ticketSelection.adult * TICKET_PRICES.adult} Ft</div>
                  </>
                )}
                
                {ticketSelection.student > 0 && (
                  <>
                    <div className="text-gray-300">{ticketSelection.student}x Student</div>
                    <div className="text-right">{ticketSelection.student * TICKET_PRICES.student} Ft</div>
                  </>
                )}
                
                {ticketSelection.senior > 0 && (
                  <>
                    <div className="text-gray-300">{ticketSelection.senior}x Senior</div>
                    <div className="text-right">{ticketSelection.senior * TICKET_PRICES.senior} Ft</div>
                  </>
                )}
                
                <div className="text-gray-300">Seats</div>
                <div className="text-right">{formatSeats()}</div>
                
                <div className="text-gray-300 font-bold text-lg pt-3 border-t border-slate-600">Total:</div>
                <div className="text-right font-bold text-lg pt-3 border-t border-slate-600">{calculateTotalPrice()} Ft</div>
              </div>
            </div>
            
            <button 
              onClick={handleConfirmBooking}
              className="w-full py-3 rounded-md bg-white text-slate-900 hover:bg-gray-200 font-bold"
            >
              Confirm Booking
            </button>
            
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full mt-4 py-3 rounded-md border border-slate-600 text-white hover:bg-slate-800 bg-transparent"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary; 