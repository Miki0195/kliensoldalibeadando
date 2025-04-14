import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import MovieDetail from './MovieDetail';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MovieBrowser = ({ movies }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [ticketSelection, setTicketSelection] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  useEffect(() => {
    const today = new Date().getDay(); 
    const todayIndex = today === 0 ? 6 : today - 1;
    setSelectedDay(DAYS_OF_WEEK[todayIndex]);
  }, []);

  const getMoviesForDay = () => {
    if (!selectedDay) return [];
    
    return movies.filter(movie => 
      movie.screenings.some(screening => 
        screening.weekday === selectedDay
      )
    );
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setTicketSelection(null);
    setSelectedSeats([]);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setTicketSelection(null);
    setSelectedSeats([]);
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setTicketSelection(null);
    setSelectedSeats([]);
  };

  const moviesToShow = getMoviesForDay();

  return (
    <div>
      {/* Day Selector */}
      <div className="mb-8 px-4">
        <div className="day-selector rounded-lg overflow-hidden p-3 md:p-4">
          <div className="flex flex-wrap justify-center gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                className={`px-3 py-2 md:px-5 md:py-3 font-medium rounded-md min-w-[80px] ${
                  selectedDay === day
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                } transition-colors duration-200`}
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedMovie ? (
        <MovieDetail 
          movie={selectedMovie} 
          selectedDay={selectedDay}
          onBackClick={handleBackToMovies}
          selectedShowtime={selectedShowtime}
          setSelectedShowtime={setSelectedShowtime}
          ticketSelection={ticketSelection}
          setTicketSelection={setTicketSelection}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6">{selectedDay}</h2>
          
          {moviesToShow.length === 0 ? (
            <p className="text-center text-gray-400">No movies available for this day.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moviesToShow.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  selectedDay={selectedDay}
                  onSelect={() => handleMovieSelect(movie)} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieBrowser; 