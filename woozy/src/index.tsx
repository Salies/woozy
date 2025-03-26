import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { EventList } from './pages/EventList/index.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			{/* if is not home, show header */}
			{location.pathname !== '/' && <Header />}
			<main class="container-fluid">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/events" component={EventList} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<footer>
				Made with
				<a href="https://www.youtube.com/watch?v=BUVL020cIfk" target="_blank" style="text-decoration:none"> 🐉🌌 </a>
				by <a href="http://github.com/Salies/" style="text-decoration:none" target="_blank">Salies</a>.
				<br/>
				All original data pulled from
				<a href="https://hltv.org" target="_blank" style="text-decoration:none"> HLTV</a>.
				<br/>
				This project is 100% non-profit and open-source.
			</footer>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
