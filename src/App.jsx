import { React, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import MovieCard from './components/MovieCard';
import Search from './components/Search';
import Spinner from './components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${API_KEY}`,
	},
};

// API - Application Programming Interface
// a set of rules that allows one software application to talk to another (database/server)

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [errorMessage, seterrorMessage] = useState('');
	const [movieList, setMovieList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedSearchTerm, setDebounceSearchTerm] = useState('');

	// Debounce the search term to prevent making too many API requests
	// by waiting for the user to stop typing for 500ms
	useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

	async function fetchMovies(query = '') {
		setIsLoading(true);
		seterrorMessage('');

		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

			const response = await fetch(endpoint, API_OPTIONS);

			if (!response.ok) {
				throw new Error('Failed to fetch movies');
			}

			const data = await response.json();

			if (data.Response === 'false') {
				seterrorMessage(data.error || 'failed to fetch movies');
				setMovieList([]);
				return;
			}

			setMovieList(data.results || []);
		} catch (error) {
			console.error(`error fetching the movies: ${error}`);
			seterrorMessage('Error fetching moveis. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	return (
		<main>
			<div className="pattern" />
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1>
						Find <span className="text-gradient">Movies</span> You'll Enjoy
						Without the Hassle
					</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>
				<section className="all-movies">
					<h2 className="mt-[40px]">All Movies</h2>

					{isLoading ? (
						<p>
							<Spinner />
						</p>
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movieList.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

export default App;
