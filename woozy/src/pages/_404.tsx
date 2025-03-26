const washedClowns = [
	"15631/kscerato",
	"2553/snax",
	"9032/magisk",
	"7412/gla1ve"
];

export function NotFound() {
	const clown = washedClowns[Math.floor(Math.random() * washedClowns.length)];
	const clownUrl = `https://www.hltv.org/player/${clown}`;

	return (
		<section>
			<h1>404: Not Found</h1>
			<p>no goats here, only <a href={clownUrl} target="_blank">washed clowns</a> 🤡</p>
		</section>
	);
}
