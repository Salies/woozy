const { chromium } = require('patchright');
const { config } = require('dotenv');
const { writeFileSync, existsSync, mkdirSync } = require('fs');

config();

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

(async () => {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.hltv.org/');

    // accept cookies
    const cookieBtn = await page.$('#CybotCookiebotDialogBodyButtonDecline');
    await cookieBtn.evaluate( cookieBtn => cookieBtn.click() );

    // login to HLTB
    const loginBtn = await page.$('.navsignin');
    await loginBtn.evaluate( loginBtn => loginBtn.click() );
    const usernameInput = await page.$('#loginpopup > form:nth-child(2) > input:nth-child(1)');
    await usernameInput.evaluate((el, value) => el.value = value, process.env.HLTV_USERNAME);
    const passwdInput = await page.$('#loginpopup > form:nth-child(2) > input:nth-child(2)');
    await passwdInput.evaluate((el, value) => el.value = value, process.env.HLTV_PASSWORD);
    console.log("Form filled. Waiting to sign in.");
    await delay(5000);
    console.log("Signing in...");
    const submitBtn = await page.$('#loginpopup > form:nth-child(2) > button');
    await submitBtn.evaluate( submitBtn => submitBtn.click() );

    console.log("Signed in. Waiting for the page to load.");
    await delay(parseInt(process.env.HLTV_CAPTCHA_DELAY) * 1000);

    // go to the fantasy page
    const fantasyUrl = `https://www.hltv.org/fantasy/${process.env.TARGET_EVENT_ID}/overview`;
    await page.goto(fantasyUrl);

    await delay(5000);

    // get event logo, name and url
    // the event url will be used later to get the event teams
    const logoSelector = "#fantasy > div > div.fantasy-content.fantasy-container > div > div > div.eventBarFragment > div.countdownContainer > div > div.logoBox > img";
    const eventSelector = "#fantasy > div > div.fantasy-content.fantasy-container > div > div > div.eventBarFragment > div.countdownContainer > div > div.textBox > h1 > a";

    const logoSrc = await page.$eval(logoSelector, logo => logo.src);
    const eventName = await page.$eval(eventSelector, event => event.innerText);
    const eventUrl = await page.$eval(eventSelector, event => event.href);
    console.log(`Event logo: ${logoSrc}`);
    console.log(`Event name: ${eventName}`);
    console.log(`Event url: ${eventUrl}`);

    // join the league
    const joinBtn = await page.$('#fantasy > div > div.fantasy-content.fantasy-container > div > div > div.eventBarFragment > div.countdownContainer > div > div.textBox > div.playNowCta > a:nth-child(1)');
    await joinBtn.evaluate( joinBtn => joinBtn.click() );

    await delay(3000);

    // create a team
    await page.type('.team-name-input', 'wooz2002');

    await delay(3000);

    const createBtn = await page.$('#fantasy > div > div.fantasy-content.fantasy-container > div > div > form > div.join-inputs > input.create-team-btn');
    await createBtn.evaluate( createBtn => createBtn.click() );

    await delay(3000);

    console.log("Getting player data...")
    // now, let's get our precious data!
    // we'll only get player data for now, we'll get team data from the main page later
    const players = [];

    const playersCon = await page.$$(".teamPlayer");
    const playersConLength = playersCon.length;
    console.log(`Number of players: ${playersConLength}`);

    // for each player...
    for (let i = 0; i < playersConLength; i++) {
        // get img from the container
        const playerImg = await playersCon[i].$('.player-picture');
        const playerImgSrc = await playerImg.evaluate(img => img.src);
        // get player name
        const playerName = await playersCon[i].$('span');
        const playerNameText = await playerName.evaluate(name => name.innerText);
        // get player price
        const playerPrice = await playersCon[i].$('.playerButtonText');
        const playerPriceText = await playerPrice.evaluate(price => price.innerText);
        // get player id from url
        const playerUrl = await playersCon[i].$('a');
        const playerUrlHref = await playerUrl.evaluate(url => url.href);
        const playerId = playerUrlHref.split("/")[5];
        // get player stats
        const playerStats = {
            rating: 0,
            ct_rating: 0,
            t_rating: 0,
            awp: 0,
            hs: 0,
            entry_rounds: 0,
            clutch_rounds: 0,
            support_rounds: 0,
            mk_rounds: 0,
            dpr: 0
        };
        const playerStatsCons = await playersCon[i].$$('.back-value');
        playerStats.rating = await playerStatsCons[0].evaluate(stats => stats.innerText);
        playerStats.ct_rating = await playerStatsCons[1].evaluate(stats => stats.innerText);
        playerStats.t_rating = await playerStatsCons[2].evaluate(stats => stats.innerText);
        playerStats.awp = await playerStatsCons[3].evaluate(stats => stats.innerText);
        playerStats.hs = await playerStatsCons[4].evaluate(stats => stats.innerText);
        playerStats.entry_rounds = await playerStatsCons[5].evaluate(stats => stats.innerText);
        playerStats.clutch_rounds = await playerStatsCons[6].evaluate(stats => stats.innerText);
        playerStats.support_rounds = await playerStatsCons[7].evaluate(stats => stats.innerText);
        playerStats.mk_rounds = await playerStatsCons[8].evaluate(stats => stats.innerText);
        playerStats.dpr = await playerStatsCons[9].evaluate(stats => stats.innerText);

        players.push({
            name: playerNameText,
            id: playerId,
            url_name: playerUrlHref.split("/")[6].split("?")[0],
            price: playerPriceText,
            img: playerImgSrc,
            stats: playerStats
        });
    }


    console.log("Getting teams data...")
    // now we get the team data
    await page.goto(eventUrl);
    await delay(3000);
    const teams = [];

    const teamBoxes = await page.$$(".team-box");
    const teamBoxesLength = teamBoxes.length;
    console.log(`Number of teams: ${teamBoxesLength}`);

    // for each team...
    for (let i = 0; i < teamBoxesLength; i++) {
        // get img from the container
        const teamImg = await teamBoxes[i].$('img');
        const teamImgSrc = await teamImg.evaluate(img => img.src);
        // get team name
        const teamName = await teamBoxes[i].$('.team-name .text-container');
        const teamNameText = await teamName.evaluate(name => name.innerText);
        // get team hltv rank
        const teamHltvRank = await teamBoxes[i].$('.event-world-rank');
        const teamHltvRankText = await teamHltvRank.evaluate(rank => rank.innerText);
        // get team valve rank
        const teamValveRank = await teamBoxes[i].$('.event-vrs-rank');
        const teamValveRankText = await teamValveRank.evaluate(rank => rank.innerText);
        // get team id from url
        const teamUrl = await teamBoxes[i].$('a');
        const teamUrlHref = await teamUrl.evaluate(url => url.href);
        const teamId = teamUrlHref.split("/")[4];
        const teamUrlName = teamUrlHref.split("/")[5];
        // get team player ids to sync later
        const teamPlayerIds = [];

        const teamPlayers = await teamBoxes[i].$$('.player');

        for(let j = 0; j < 5; j++) {
            const teamPlayerUrl = await teamPlayers[j].$('a');
            if(!teamPlayerUrl) {
                console.log("No player url found (probably TBA). Skipping...");
                continue;
            }
            const teamPlayerUrlHref = await teamPlayerUrl.evaluate(url => url.href);
            const teamPlayerId = teamPlayerUrlHref.split("/")[4];
            teamPlayerIds.push(teamPlayerId);
        }

        teams.push({
            id: teamId,
            name: teamNameText,
            img: teamImgSrc,
            hltv_rank: teamHltvRankText,
            valve_rank: teamValveRankText,
            url_name: teamUrlName,
            players: teamPlayerIds,
        });
    }

    console.log("All data collected. Closing browser.")
    await browser.close();

    // saving data to json files
    console.log("Saving data...")
    
    // create event folder if it doesn't exist
    const eventFolder = `./data/events/${process.env.TARGET_EVENT_ID}`;
    if (!existsSync(eventFolder)){
        mkdirSync(eventFolder, { recursive: true });
    }

    // save event data to event.json
    const eventData = {
        id: process.env.TARGET_EVENT_ID,
        name: eventName,
        img: logoSrc
    };

    writeFileSync(`${eventFolder}/event.json`, JSON.stringify(eventData, null, 4), 'utf-8');

    // save players data to players.json
    writeFileSync(`${eventFolder}/players.json`, JSON.stringify(players, null, 4), 'utf-8');

    // save teams data to teams.json
    writeFileSync(`${eventFolder}/teams.json`, JSON.stringify(teams, null, 4), 'utf-8');
})();