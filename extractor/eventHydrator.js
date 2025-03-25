// GET EVENT TITLE AND IMAGES

import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';

const eventData = JSON.parse(readFileSync('event_data.json', 'utf8'));

const targetUrl = `https://www.hltv.org/fantasy/${eventData.id}/overview`;

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

// prepare selectors to event landing page
const eventTitleSel = "#fantasy > div > div.fantasy-content.fantasy-container > div > div > div.eventBarFragment > div.countdownContainer > div > div.textBox > h1 > a";
const eventImageSel = "#fantasy > div > div.fantasy-content.fantasy-container > div > div > div.eventBarFragment > div.countdownContainer > div > div.logoBox > img";

await page.goto(targetUrl);

// get basic event data
const eventTitle = await page.$eval(eventTitleSel, el => el.innerText);
const eventImage = await page
  .evaluate((sel) => {
    return document.querySelector(sel).getAttribute('src');
  }, eventImageSel);

await browser.close();

// create directory for event
const eventDir = `./${eventData.id}`;
if (!existsSync(eventDir)) {
  mkdirSync(eventDir);
}
// create img dir
if (!existsSync(`${eventDir}/img`)) {
  mkdirSync(`${eventDir}/img`);
}
// create img/players
if (!existsSync(`${eventDir}/img/players`)) {
  mkdirSync(`${eventDir}/img/players`);
}
// create img/teams
if (!existsSync(`${eventDir}/img/teams`)) {
  mkdirSync(`${eventDir}/img/teams`);
}

// save title to txt in dir
const eventTitlePath = `${eventDir}/title.txt`;
writeFileSync(eventTitlePath, eventTitle);

// save event to webp in dir
const eventImgPath = `${eventDir}/img/logo.webp`;
const eventImg = await fetch(eventImage);
const eventImgBuffer = await eventImg.arrayBuffer();
writeFileSync(eventImgPath, Buffer.from(eventImgBuffer));

const nPlayers = 5 * eventData.teams.length;
let i = 1;
let j = 1;
// save player images
eventData.teams.forEach(async (team) => {
  // TODO: I could fetch the team IDs from the player page
  // but it's too much work for now. I'll use the names as keys.
  console.log(`Downloading team image ${j++}/${eventData.teams.length}`);
  const teamImgPath = `${eventDir}/img/teams/${team.name}.webp`;
  if(existsSync(teamImgPath)) {
    console.log('Team image already exists. Skipping.');
  }
  const teamImg = await fetch(team.image);
  const teamImgBuffer = await teamImg.arrayBuffer();
  writeFileSync(teamImgPath, Buffer.from(teamImgBuffer));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  team.players.forEach(async (player) => {
    console.log(`Downloading player image ${i++}/${nPlayers}`);
    const playerImgPath = `${eventDir}/img/players/${player.id}.webp`;

    if(existsSync(playerImgPath)) {
      console.log('Player image already exists. Skipping.');
      return;
    }

    const playerImg = await fetch(player.image);
    const playerImgBuffer = await playerImg.arrayBuffer();
    writeFileSync(playerImgPath, Buffer.from(playerImgBuffer));
    // wait 1s to avoid being blocked
    // TODO: this doesn't work
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});