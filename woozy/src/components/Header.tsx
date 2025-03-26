import { useLocation } from 'preact-iso';

export function Header() {
	const { path } = useLocation();
	if (path === '/') return null;

	return (
		<header>
			<h1>🐝 woozy</h1>
			<hr />
		</header>
	);
}
