import type { GameButton } from '../../types/game';

// The math for polar coordinates
const { sin, cos } = Math;

// Helper function to check is a string describes a valid game:
// - consists of letters only
// - has the required number of letters
// - the required letter (index 0) exists only once
export const isValidGame = (game: string, length: number): boolean => {
	const containsOnlyLetter = /^[A-Za-z]*$/.test(game);
	const isOfLength = game.length === length;

	let isRequiredLetterUnique = true;
	
	const optionalLetters = game.slice(1, game.length).split('');

	for(let letter of optionalLetters) {
		if(letter === game[0]) {
			isRequiredLetterUnique = false;
			break;
		}
	}

  return(!!game && containsOnlyLetter && isOfLength && isRequiredLetterUnique);
}

const __alphabetically__ = (a: string, b: string): number => a.localeCompare(b);

export const extractGame = (
	buttons: GameButton[],
	length: number,
): string => {
	if(!buttons && typeof buttons !== 'object')
		throw new Error('ERROR -- extractGame: invalid buttons input');
	
	// if(buttons.length !== length)
	// 	throw new Error('ERROR -- extractGame: invalid "buttons" length');

	const gameHash = buttons.reduce((val, button) => val + button.letter, '');
	const first = gameHash.slice(0, 1);
	const rest = gameHash.slice(1, gameHash.length);

	const sortedGameHash = first + rest.split('').sort(__alphabetically__).join('');

	return sortedGameHash;
}

export const constructGameButtons = (game: string): GameButton[] => {
	const buttons: GameButton[] = [];

	for(let letter of game) {
		buttons.push({ letter, isSelected: false });
	}

	return(buttons);
}

export const constructNewGameButton = (
	buttons: GameButton[],
	letters: string,
): GameButton | null => {
	const [firstButton] = buttons;
	const randomLetter = letters[Math.floor(Math.random() * letters.length)];

	let button: GameButton | null = null;

	if(randomLetter !== firstButton?.letter) {
		button = { letter: randomLetter, isSelected: false };
	}

	return button;
}

// Helpers to compute polar coordinates component-wise
const __calcXY__ = (
	radius: number,
	buttonSize: number,
	angle: number,
	f: Function,
): number => {
	return(radius * f(angle) + radius - .5 * buttonSize);
}

export const calcX = (
	angle: number,
	radius: number,
	buttonSize: number,
): number => {
	return(__calcXY__(radius, buttonSize, angle, cos));
}

export const calcY = (
	angle: number,
	radius: number,
	buttonSize: number,
): number => {
	return(__calcXY__(radius, buttonSize, angle, sin));
}
