import {
	useState,
	useContext,
	useMemo,
	useCallback,
	useEffect,
} from 'react';
import { useQuery } from 'react-query';
import { useKey } from 'react-use';
import { Notify } from 'notiflix';
import { IoSend } from 'react-icons/io5';
import { FiDelete } from 'react-icons/fi';
import Pea from './Pea';
import DisplaySelection from './DisplaySelection';
import DisplaySolutions from './DisplaySolutions';
import {
	isValidGame,
	calcX,
	calcY,
	extractGame,
	constructGameButtons,
	constructNewGameButton,
} from './game-utils';
import { checkTermDefined } from '../../utils/fetch-lib';
import SolutionsContext from '../../context/solutions-context';
import './Game.scss';
import useBreakpoints from '../../hooks/use-breakpoints';
import { GameButton } from '../../types/game';

interface DataElement extends HTMLElement {
	dataset: {
		idx: string;
	}
}

// The math for polar coordinates
const { PI } = Math;

// Global constants
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const VOWELS = 'aeiou';
const ALPHABET_EXTENDED = VOWELS + VOWELS + ALPHABET;

// The main components
function Game({ boardSize, buttonSize, numberOfButtons: N }: {
	boardSize: number;
	buttonSize: number;
	numberOfButtons: number;
}): JSX.Element {
	// Set up components state
	const [selection, setSelection] = useState<string>('');
	const [buttons, setButtons] = useState<GameButton[]>([]);

	// Load solutions context (locally stored)
	const { solutions, setSolutions } = useContext(SolutionsContext);

	// Setup the query for checking the validity of submissions
	const {
		data: isTermDefined,
		error: termCheckerError,
		isLoading: isSubmitting,
		isFetchedAfterMount,
		refetch: checkTerm,
	} = useQuery(
		['isDefined', selection],
		() => checkTermDefined(selection),
		{ enabled: false },
	);

	// Breakpoint specific definitions
	const submitLabel = useBreakpoints<string>({ sm: '', dflt: 'Submit' });
	const isSubmittingLabel = useBreakpoints<string>({ sm: '', dflt: 'Submitting...'});
	const deleteLabel = useBreakpoints<string>({ sm: '', dflt: 'Delte selection'});

	// Compute internal constants from props or state
	const radius = useMemo(() => .5 * boardSize, [boardSize]);
	const center = useMemo(() => radius - .5 * buttonSize, [buttonSize, radius]);
	const phi = useMemo(() => 2 * PI / (N - 1), [N]);

	const firstletter = useMemo(() => {
		const [firstButton] = buttons;

		return(firstButton?.letter);
	}, [buttons]);

	const gameSolutions = useMemo(() => (
		JSON.parse(solutions || '')[extractGame(buttons, N)]
	), [buttons, solutions, N]);

	const isGameSolutionsLoaded = useMemo(() => (
		!!gameSolutions && typeof gameSolutions === 'object'
	), [gameSolutions]);

	// Load the game
	useEffect(() => {
		const { hash } = window.location;
		const game = hash.slice(1, hash.length);

		if(isValidGame(game, N) && buttons.length === 0) {
			setButtons(constructGameButtons(game));
		} else if(buttons.length < N) {
			const newButton = constructNewGameButton(buttons, ALPHABET_EXTENDED);

			if(newButton) {
				setButtons([
					...buttons,
					newButton,
				]);
			} else {
				setButtons([...buttons]);
			}
			
		}
	}, [buttons, N]);

	// Handler for selecting a letter
	const handleSelect = (e: Event): void => {
		e.preventDefault();

		const { idx } = (e.target as DataElement).dataset;

		const i = Number(idx);

		if(!buttons[i].isSelected) {
			const { letter } = buttons[i];

			const buttonSelected = { letter, isSelected: true };

			const buttonsBuffer = buttons;
			buttonsBuffer[i] = buttonSelected;

			setSelection(current => current + buttons[i].letter);
			setButtons(buttonsBuffer);
		}
	}

	// Handler for deleting the last input
	const handleDelete = () => {
		const buttonsBuffer = buttons;
		const lastChar = selection[selection.length - 1];
		const newSelection = selection.slice(0, -1);

		setSelection(newSelection);

		for(let i = 0; i < buttons.length; i++) {
			if(buttons[i].letter === lastChar && buttons[i].isSelected) {
				buttonsBuffer[i].isSelected = false;
				setButtons(buttonsBuffer);
				break;
			}
		}
	}

	// Handler for deleting the entire submission
	const handleDeleteAll = useCallback(() => {
		setSelection('');
		const buttonsHTML = document.getElementsByClassName('game__button');

		Array.from(buttonsHTML).forEach((button) => {
			button.classList.remove('selected');
		});

		// for(let buttonHTML of buttonsHTML) {
		// 	buttonHTML.classList.remove('selected');
		// }

		setButtons(buttons.map(({ letter}) => {
			return { letter, isSelected: false };
		}));
	}, [buttons]);

	// Handler for submitting
	const handleSubmit = () => {
		const [firstButton] = buttons;
		const requiredLetter = firstButton.letter;

		if(!selection) {
			Notify.info(
				'Don´t you want to try submitting something a little bit more substantial?'
			);
		} else if(!selection.includes(requiredLetter)) {
			Notify.info(
				`The selected word must contain the letter "${requiredLetter}"`
			);
		} else {
			checkTerm();
		}
	};

	// Control keyboard input
	useKey(
		({ key }: KeyboardEvent): boolean => {
			if(key === 'Backspace') {
				handleDelete();
				return false;
			}

			if(key === 'Enter') {
				handleSubmit();
				return false;
			}

			const buttonsBuffer = buttons;

			for(let i = 0; i < buttons.length; i++) {
				if(buttons[i].letter === key && !buttons[i].isSelected) {
					buttonsBuffer[i].isSelected = true;
					setButtons(buttonsBuffer);
					setSelection(current => current + key);
					break;
				}
			}

			return false;
		},
		() => null,
		{ event: 'keydown' },
	);

	// Feeback for submissions
	useEffect(() => {
		const game = extractGame(buttons, N);

		if(isFetchedAfterMount) {
			if(!termCheckerError && isTermDefined) {
				const parsed = JSON.parse(solutions || '{}');
				const gameSolutions = new Set(parsed[game] || []);

				if(gameSolutions.has(selection)) {
					Notify.warning(`You alredy found "${selection}"`);
				} else {
					Notify.success('Yip-pea!');
				}

				gameSolutions.add(selection);
				parsed[game] = Array.from(gameSolutions);// [...gameSolutions]

				setSolutions(JSON.stringify(parsed));
			} else {
				Notify.failure(`"${selection}" isn't a word.`);
			}

			handleDeleteAll();
		}
	}, [
		buttons,
		N,
		selection,
		solutions,
		isTermDefined,
		termCheckerError,
		isFetchedAfterMount,
		setSolutions,
		handleDeleteAll,
	]);

	return(
		<div className="game">
			<DisplaySelection
				requiredLetter={firstletter}
				selection={selection}
			/>

			<div
				className="game__wrapper"
				style={{
					width: `${boardSize}px`,
					height: `${boardSize}px`,
					transformOrigin: 'center',
				}}
			>
				{buttons.map(({ letter, isSelected}, idx) => {
					const isRequired = idx === 0;
					const arg =  idx * phi + PI;

					const peaProps = {
						idx,
						x: isRequired ? center : calcX(arg, radius, buttonSize),
						y: isRequired ? center : calcY(arg, radius, buttonSize),
						size: buttonSize,
						letter,
						isRequired,
						isSelected,
						handleSelect,
					};

					return(
						<Pea key={`pea-${idx}`} {...peaProps} />
					);
				})}
			</div>

			<DisplaySolutions
				isLoaded={isGameSolutionsLoaded}
				data={gameSolutions}
			/>

			<div className="game__controls">				
				<button className="game__controls__control" onClick={handleSubmit}>
					<IoSend />
					{submitLabel &&
						<span>{isSubmitting ? isSubmittingLabel : submitLabel}</span>
					}
				</button>

				<button className="game__controls__control" onClick={handleDeleteAll}>
					<FiDelete />
					{deleteLabel && <span>{deleteLabel}</span>}
				</button>
			</div>
		</div>
	);
}

export default Game;
