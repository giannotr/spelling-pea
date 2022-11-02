import { createContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { useLocalStorage } from 'react-use';

interface SolutionsState {
	solutions: string | undefined;
	setSolutions: Dispatch<SetStateAction<string | undefined>>;
}

const SolutionsContext = createContext<SolutionsState>({
	solutions: undefined,
	setSolutions: () => null,
});

export function SolutionsContextProvider({ children }: {
	children: ReactNode;
}): JSX.Element {
	const [solutions, setSolutions] = useLocalStorage<string>('spelling-pea-solutions', '{}');

	return(
		<SolutionsContext.Provider value={{ solutions, setSolutions }}>
			{children}
		</SolutionsContext.Provider>
	);
}

export default SolutionsContext;
