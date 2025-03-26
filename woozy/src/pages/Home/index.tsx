import './style.css';

const goats = [
	"7998/s1mple",
	"11893/zywoo",
	"7592/device",
	"21167/donk",
	"2023/fallen",
	"3055/flusha",
	"11816/ropz"
	// no Nik0la 0 major
	// no m0nesy 0 major
]

export function Home() {
	const randomGoat = goats[Math.floor(Math.random() * goats.length)];
	const goatUrl = `https://www.hltv.org/player/${randomGoat}`;

	return (
		<div class="home">
			<hgroup>
				<h2>woozy</h2>
				<p>
					the <a href={goatUrl} target="_blank" id="goat">🐐</a> fantasy
					manager
				</p>
			</hgroup>
			<div role="group">
				<a class="contrast" href="https://www.hltv.org/fantasy" target="_blank" role="button">to HLTV</a>
				<a href="./events" role="button">current events</a>
			</div>
		</div>
	);
}