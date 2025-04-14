import { useState, useEffect } from 'react';
import './App.css';
import MovieBrowser from './components/MovieBrowser';
import moviesData from './assets/movies.json';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMovies(moviesData);
    setLoading(false);
  }, []);

  return (
    <div className="app-container min-h-screen bg-slate-950 text-white">
      <header className="bg-slate-950 p-4 shadow-lg border-b border-slate-800">
        <div className="container mx-auto px-4 flex items-center">
          <h1 className="text-2xl font-bold flex items-center text-green-400">
            <span className="text-green-400 mr-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" fill="#4ade80" />
                <path d="M6 5V19M10 5V19M14 5V19M18 5V19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            TIKERA
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 max-w-6xl">
        {loading ? (
          <div className="text-center">Loading movies...</div>
        ) : (
          <MovieBrowser movies={movies} />
        )}
      </main>
    </div>
  );
}

export default App;
