import React, { useContext, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SolutionsContext from '../../context/solutions-context';
import './Home.scss';

function Home() {
	const { solutions } = useContext(SolutionsContext);
	let navigate = useNavigate();

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		navigate(`/game#${e.target.value}`);
	};

	return(
		<header className="header">
			<h1>Spelling Pea</h1>
			
			<div className="link">
				<Link to="/game">Start a new (random) game</Link>
			</div>

			{solutions && 
				<div>
					... or continue a previous game
					<div>
						<select onChange={handleChange} defaultValue="">
							<option value="" disabled>Select a game...</option>
							{Object.keys(JSON.parse(solutions)).map((game) => (
								<option key={game} value={game}>
									{game}
								</option>
							))}
						</select>
					</div>
				</div>
			}
		</header>
	);
}

export default Home;
