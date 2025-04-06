import { useLocation } from 'preact-iso';

export function Header() {
	const { path } = useLocation();
	if (path === '/') return null;

	return (
		<header>
			<h1><a href="https://woozy.saliesbox.com/">🐝 woozy</a></h1>
			<hr />
		</header>
	);
}
