// Helper component to render the selection
export default function DisplaySelection({
	selection,
	requiredLetter,
}: {
	selection: string;
	requiredLetter: string;
}): JSX.Element {
	const letters: string[] = selection.split('');

	const letterCls = (letter: string) => (
		`game__selection__letter${letter === requiredLetter ? ' required' : ''}`
	);

	return(
		<div className="game__selection">
			{letters.map((letter, idx) => (
				<div key={'letter' + idx} className={letterCls(letter)}>
					{letter}
				</div>
			))}
		</div>
	);
}
