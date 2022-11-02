import { useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Notify } from 'notiflix';
import { SolutionsContextProvider } from './context/solutions-context';
import useBreakpoints from './hooks/use-breakpoints';
import Home from './routes/home/Home';
import Game from './routes/game/Game';
import './App.scss';

const queryClient = new QueryClient();

Notify.init({
	width: '300px',
	position: 'right-bottom',
	fontFamily: 'Exo 2',
});

const numberOfButtons = 9;

export default function App(): JSX.Element {
	const boardSize = useBreakpoints<number>({ dflt: 350, xs: 150, sm: 215, md: 290 });
	const buttonSize = useBreakpoints<number>({ dflt: 80, xs: 45, sm: 65, md: 70 });

	const gameProps = useMemo(() => (
		{ boardSize, buttonSize, numberOfButtons }
	), [boardSize, buttonSize]);

	return (
		<>
			<Helmet>
				<title>Spelling pea 🥬</title>
			</Helmet>

			<QueryClientProvider client={queryClient}>
				<SolutionsContextProvider>
					<BrowserRouter>
						<div className="App">
							<Routes>
								<Route index element={<Home />} />
								<Route path="/game" element={<Game {...gameProps} />} />
							</Routes>
						</div>
					</BrowserRouter>
				</SolutionsContextProvider>
			</QueryClientProvider>
		</>
	);
}
