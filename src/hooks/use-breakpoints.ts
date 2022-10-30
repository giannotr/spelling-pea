import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

const BREAK_XS = 280;
const BREAK_SM = 420;
const BREAK_MD = 840;
const BREAK_LG = 1260;
const BREAK_XL = 1680;

export default function useBreakpoints<T>({ dflt, xs, sm, md, lg, xl }: {
	dflt: T;
	xs?: T;
	sm?: T;
	md?: T;
	lg?: T;
	xl?: T;
}): T {
	const { width } = useWindowSize();

	const value: T = useMemo(() => {
		let valueByBreakpoint = dflt;

		if(xl !== undefined && width < BREAK_XL)
			valueByBreakpoint = xl;

		if(lg !== undefined && width < BREAK_LG)
			valueByBreakpoint = lg;

		if(md !== undefined && width < BREAK_MD)
			valueByBreakpoint = md;

		if(sm !== undefined && width < BREAK_SM)
			valueByBreakpoint = sm;
		
		if(xs !== undefined && width < BREAK_XS)
			valueByBreakpoint = xs;

		return valueByBreakpoint;
	}, [width, dflt, xs, sm, md, lg, xl]);

	return value;
}
