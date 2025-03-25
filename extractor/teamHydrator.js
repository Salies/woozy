// GET TEAM IDS

import { chromium } from 'patchright';
import { readFileSync, writeFileSync } from "fs";

// preparing base data
const eventData = JSON.parse(readFileSync("519/event_data.json", "utf8"));

const samplePlayers = [];

// get one player from each team
eventData.teams.forEach((team) => {
    const player = team.players[0];
    const playerUrl = `https://www.hltv.org/player/${player.id}/${player.url_name}`;
    samplePlayers.push(playerUrl);
});

const teamUrlSelector = ".playerContainer .playerTeam .listRight a";

const browser = await chromium.launch({headless: false});
const page = await browser.newPage();

console.log("Acquiring team data...");
for (let i = 0; i < samplePlayers.length; i++) {
    const playerUrl = samplePlayers[i];

    await page.goto(playerUrl);

    await page.waitForSelector(teamUrlSelector);

    const teamUrl = await page.$eval(teamUrlSelector, el => el.getAttribute("href"));
    const teamId = teamUrl.split("/")[2];
    const teamUrlName = teamUrl.split("/")[3];

    console.log(teamId, teamUrlName);

    eventData.teams[i].id = teamId;
    eventData.teams[i].url_name = teamUrlName;

    await new Promise((r) => setTimeout(r, 1000));
}

await browser.close();

console.log("Saving hydrated event data...");
// save to event_data_hydra.json
const eventHydraPath = `./${eventData.id}/event_data_hydra.json`;

writeFileSync(eventHydraPath, JSON.stringify(eventData, null, 2));