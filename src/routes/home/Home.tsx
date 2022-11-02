import { useContext, useMemo, ChangeEvent, ChangeEventHandler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToggle } from 'react-use';
import { HiDotsHorizontal } from 'react-icons/hi';
import SolutionsContext from '../../context/solutions-context';
import Overlay from '../../components/Overlay/Overlay';
import { ReactComponent as Peas } from './peas.svg';
import './Home.scss';

function PreviousGames({
	gamesList,
	selectHandler,
}: {
	gamesList: string[];
	selectHandler: ChangeEventHandler<HTMLSelectElement>;
}) {
	return(
		<div>
			Continue a previous game
			<div>
				<select onChange={selectHandler} defaultValue="">
					<option value="" disabled>Select a game...</option>
					{gamesList.map((game) => (
						<option key={game} value={game}>
							{game}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default function Home() {
	const { solutions } = useContext(SolutionsContext);
	const [isMenuOpen, toggleMenu] = useToggle(false);
	let navigate = useNavigate();

	const handleSelectGame = (e: ChangeEvent<HTMLSelectElement>) => {
		navigate(`/game#${e.target.value}`);
	};

	const toggleCls = useMemo(() => {
		return(`intro__menu__toggle${isMenuOpen ? ' toggled' : ''}`);
	}, [isMenuOpen]);

	return(
		<>
			<header className="header">
				<div className="intro__exclamation">Yip-pea!</div>

				<div className="intro__peas">
					<Peas style={{
						minWidth: '350px',
						width: '50%',
						height: 'auto',
					}} />
				</div>

				<h1 className="intro__title">Spelling Pea</h1>

				<h2 className="intro__subtitle">How many words can you find?</h2>
				
				<div className="intro__link">
					<Link to="/game">Start</Link>
				</div>
			</header>

			<button className={toggleCls} onClick={toggleMenu}>
				<HiDotsHorizontal />
			</button>

			<Overlay active={isMenuOpen}>
				<div className="intro__menu">
					{solutions &&
						<PreviousGames
							gamesList={Object.keys(JSON.parse(solutions))}
							selectHandler={handleSelectGame}
						/>
					}
				</div>
			</Overlay>
		</>
	);
}
