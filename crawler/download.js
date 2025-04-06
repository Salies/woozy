import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

async function downloadImage(url, dir, id) {
    console.log(`Downloading ${url} to ${dir}/${id}.webp`);
    const img = await fetch(url);
    const imgBuffer = await img.arrayBuffer();
    writeFileSync(`${dir}/${id}.webp`, Buffer.from(imgBuffer));
}

config();

// load json data
const evPath = `data/events/${process.env.TARGET_EVENT_ID}`
const eventData = JSON.parse(readFileSync(`${evPath}/event.json`, 'utf-8'));
console.log(eventData)
const playersData = JSON.parse(readFileSync(`${evPath}/players.json`, 'utf-8'));
console.log(playersData)
const teamsData = JSON.parse(readFileSync(`${evPath}/teams.json`, 'utf-8'));
console.log(teamsData)

// create img directory
const imgPath = `${evPath}/img`;
if (!existsSync(imgPath)) {
    mkdirSync(imgPath);
}

/// create img/players, teams
const playersImgPath = `${imgPath}/players`;
const teamsImgPath = `${imgPath}/teams`;
if (!existsSync(playersImgPath)) {
    mkdirSync(playersImgPath);
}
if (!existsSync(teamsImgPath)) {
    mkdirSync(teamsImgPath);
}

// download event image
downloadImage(eventData.img, imgPath, "logo");

// download players images
playersData.forEach((player) => {
    downloadImage(player.img, playersImgPath, player.id);
});

// download teams images
teamsData.forEach((team) => {
    downloadImage(team.img, teamsImgPath, team.id);
});