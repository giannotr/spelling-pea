import React from 'react';

export default function DisplaySolutions({ isLoaded, data }: {
	isLoaded: boolean;
	data: string[];
}): JSX.Element {
	return(
		<>
			{data && data.length > 0 &&
				<div className="game__solutions">
					<div className="game__solutions__count">
						You found
						<span>{isLoaded && data.length}</span>
						{`word${isLoaded && data.length > 1 ? 's' : ''}`}
					</div>

					<div className="game__solutions_list">
						{isLoaded && data.map((solution) => (
							<div key={solution}>{solution}</div>
						))}
					</div>
				</div>
			}
		</>
	);
}
