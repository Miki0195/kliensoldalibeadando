import { useState, useEffect } from 'react';
import TicketSelection from './TicketSelection';
import SeatSelection from './SeatSelection';
import BookingSummary from './BookingSummary';
import { getBookedSeatsForScreening } from '../services/bookingService';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const MovieDetail = ({ 
  movie, 
  selectedDay, 
  onBackClick,
  selectedShowtime,
  setSelectedShowtime,
  ticketSelection,
  setTicketSelection,
  selectedSeats,
  setSelectedSeats
}) => {
  const [currentStep, setCurrentStep] = useState('details'); 
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);

  const showtimes = movie.screenings.filter(
    screening => screening.weekday === selectedDay
  );

  useEffect(() => {
    setCurrentStep('details');
    setSelectedShowtime(null);
    setTicketSelection(null);
    setSelectedSeats([]);
  }, [movie.id, selectedDay, setSelectedShowtime, setTicketSelection, setSelectedSeats]);

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep('tickets');
    setTicketSelection({
      adult: 0,
      student: 0,
      senior: 0
    });
    setSelectedSeats([]);
  };

  const handleTicketSelectionComplete = (ticketData) => {
    setTicketSelection(ticketData);
    setCurrentStep('seats');
    setSelectedSeats([]);
  };

  const handleSeatSelectionComplete = (seats) => {
    setSelectedSeats(seats);
    setCurrentStep('summary');
    setShowSummaryPopup(true);
  };

  const getTotalTickets = () => {
    if (!ticketSelection) return 0;
    return ticketSelection.adult + ticketSelection.student + ticketSelection.senior;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'tickets':
        return (
          <TicketSelection
            ticketSelection={ticketSelection}
            onComplete={handleTicketSelectionComplete}
            onBack={() => {
              setCurrentStep('details');
              setSelectedShowtime(null);
            }}
          />
        );
      case 'seats':
        return (
          <SeatSelection
            showtime={selectedShowtime}
            totalTickets={getTotalTickets()}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            onComplete={handleSeatSelectionComplete}
            onBack={() => setCurrentStep('tickets')}
            movie={movie}
          />
        );
      case 'summary':
        return (
          <BookingSummary
            movie={movie}
            selectedDay={selectedDay}
            showtime={selectedShowtime}
            ticketSelection={ticketSelection}
            selectedSeats={selectedSeats}
            onConfirm={() => {
              alert('Booking confirmed successfully!');
              onBackClick(); 
            }}
            onBack={() => setCurrentStep('seats')}
            showPopup={showSummaryPopup}
            setShowPopup={setShowSummaryPopup}
          />
        );
      default: 
        return (
          <>
            <div className="movie-details grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="rounded-lg overflow-hidden border border-slate-700">
                  <img 
                    src={`/assets/images/${movie.image}`} 
                    alt={movie.title} 
                    className="w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                  <span className="bg-slate-700 px-3 py-1 rounded">{movie.genre}</span>
                  <span className="bg-slate-700 px-3 py-1 rounded">{formatDuration(movie.duration)}</span>
                  <span className="bg-slate-700 px-3 py-1 rounded">{movie.release_year}</span>
                </div>
                
                <p className="text-gray-300 mb-6">{movie.description}</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Select Showtime</h3>
                  
                  {showtimes.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {showtimes.map(showtime => {
                        const totalSeats = showtime.room.rows * showtime.room.seatsPerRow;
                        const bookedSeats = showtime.bookings ? showtime.bookings.length : 0;
                        
                        const localBookings = getBookedSeatsForScreening(movie.id, showtime.id);
                        const totalBookedSeats = bookedSeats + localBookings.length;
                        
                        const availableSeats = totalSeats - totalBookedSeats;
                        const isAvailable = availableSeats > 0;
                        
                        return (
                          <button
                            key={showtime.id}
                            onClick={() => isAvailable && handleShowtimeSelect(showtime)}
                            className={`px-4 py-2 rounded-md font-medium ${
                              isAvailable 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-red-500 text-white opacity-75 cursor-not-allowed'
                            } ${selectedShowtime?.id === showtime.id ? 'ring-2 ring-white' : ''}`}
                            disabled={!isAvailable}
                            title={isAvailable ? `${availableSeats} seats available` : 'No seats available'}
                          >
                            {showtime.start_time}
                            {!isAvailable && <span className="ml-2 text-xs">(Full)</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400">No showtimes available for {selectedDay}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="movie-detail container mx-auto px-4 py-6">
      <div className="flex flex-col">
        <button
          onClick={onBackClick}
          className="self-start flex items-center gap-2 text-slate-300 hover:text-white mb-8 
                    bg-slate-800 px-4 py-2 rounded-md transition-all hover:shadow-lg hover:bg-slate-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Back to movies</span>
        </button>
        
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 