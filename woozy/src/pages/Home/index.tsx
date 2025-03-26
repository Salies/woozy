import './style.css';

export function Home() {
	return (
		<div class="home">
			<hgroup>
				<h2>woozy</h2>
				<p>
					the <a href="" target="_blank" id="goat">🐐</a> fantasy
					manager
				</p>
			</hgroup>
			{/*<div class="sign-in" role="group">
				<a href="./signup" role="button">sign up</a>
				<a href="./signin" role="button" class="sign-in-btn contrast">sign in</a>
			</div>*/}
			<div role="group">
				<a class="contrast" href="https://www.hltv.org/fantasy" target="_blank" role="button">to HLTV</a>
				<a href="./events" role="button">current events</a>
			</div>
		</div>
	);
}