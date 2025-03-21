import { useEffect, useState } from 'react';

function Card({ title }) {
	const [count, setCount] = useState(0);
	const [hasLiked, setHasLiked] = useState(false);
	useEffect(() => {
		console.log(`${title} has been liked: ${hasLiked}`);
	}, [hasLiked]);

	// const [varibleName, setVariableName] = useState()
	// [initial value, updater function]
	// const [hasLiked, setHasLiked] = useState(false);

	return (
		<div
			className="card"
			onClick={() => setCount((prevState) => prevState + 1)}
		>
			<h2>
				{title} <br />
				{count}
			</h2>
			<button onClick={() => setHasLiked((prevState) => !prevState)}>
				{hasLiked ? '🤎' : '🤍'}
			</button>
		</div>
	);
}

function App() {
	return (
		<div className="card-container">
			<Card title="Star Wars" />
			<Card title="Avatar" />
			<Card title="Dune" />
		</div>
	);
}

export default App;
