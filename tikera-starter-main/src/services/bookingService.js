export const createScreeningKey = (movieId, screeningId) => {
  return `movie_${movieId}_screening_${screeningId}`;
};

export const getBookedSeats = () => {
  try {
    const bookingsJson = localStorage.getItem('tikera_bookings');
    return bookingsJson ? JSON.parse(bookingsJson) : {};
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return {};
  }
};

export const getBookedSeatsForScreening = (movieId, screeningId) => {
  const key = createScreeningKey(movieId, screeningId);
  const allBookings = getBookedSeats();
  
  return allBookings[key] || [];
};

export const addBooking = (movieId, screeningId, seats, ticketSelection) => {
  try {
    const key = createScreeningKey(movieId, screeningId);
    const allBookings = getBookedSeats();
    
    allBookings[key] = [
      ...(allBookings[key] || []),
      ...seats.map(seat => ({ ...seat, bookingTime: new Date().toISOString() }))
    ];
    
    localStorage.setItem('tikera_bookings', JSON.stringify(allBookings));
    
    const bookingDetails = {
      movieId,
      screeningId,
      seats,
      ticketSelection,
      bookingTime: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('tikera_booking_history') || '[]');
    bookingHistory.push(bookingDetails);
    localStorage.setItem('tikera_booking_history', JSON.stringify(bookingHistory));
    
    return true;
  } catch (error) {
    console.error('Error saving booking to localStorage:', error);
    return false;
  }
};

export const getBookingHistory = () => {
  try {
    const historyJson = localStorage.getItem('tikera_booking_history');
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error reading booking history from localStorage:', error);
    return [];
  }
}; 