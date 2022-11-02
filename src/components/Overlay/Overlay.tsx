import { ReactNode } from 'react';
import './Overlay.scss';

export default function Overlay({ active, children } : {
	active: boolean;
	children: ReactNode;
}): JSX.Element {
	const cls = `overlay${active ? ' active' : ''}`;
	return(
		<div className={cls}>
			{children}
		</div>
	);
}
