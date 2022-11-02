// Helper component to render one game button aka 'pea'
export default function Pea({
	idx,
	x,
	y,
	size,
	letter,
	isRequired,
	isSelected,
	handleSelect,
}: {
	idx: number;
	x: number;
	y: number;
	size: number;
	letter: string;
	isRequired: boolean;
	isSelected: boolean;
	handleSelect: any;// MouseEventHandler<HTMLDivElement>;
}): JSX.Element {

	const sty = {
		width: `${size}px`,
		height: `${size}px`,
		transform: `translate(${x}px, ${y}px)`,
	};

	const cls = `game__button${
		isRequired ? ' required' : ''
	}${
		isSelected ? ' selected' : ''
	}`;

	return(
		<div
			data-idx={idx}
			style={sty}
			className={cls}
			onClick={handleSelect}
		>
			{letter}
		</div>
	);
}
