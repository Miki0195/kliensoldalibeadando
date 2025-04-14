import React from 'react';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const MovieCard = ({ movie, selectedDay, onSelect }) => {
  const { title, image, duration, genre } = movie;
  
  const showtimes = movie.screenings.filter(
    screening => screening.weekday === selectedDay
  );

  return (
    <div 
      className="movie-card bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] cursor-pointer border border-slate-700"
      onClick={onSelect}
    >
      <div className="h-64 overflow-hidden">
        <img 
          src={`/assets/images/${image}`} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <div className="flex justify-between text-sm text-gray-300 mb-4">
          <span>{genre}</span>
          <span>{formatDuration(duration)}</span>
        </div>
        
        {showtimes.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Available Showtimes:</h4>
            <div className="flex flex-wrap gap-2">
              {showtimes.map(showtime => (
                <span 
                  key={showtime.id} 
                  className="bg-slate-700 text-white text-sm px-3 py-1 rounded"
                >
                  {showtime.start_time}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No showtimes available</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard; 