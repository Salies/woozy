import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";
import { readFileSync, readdirSync } from "fs";

const jsonPath = `./${config.target_id}/event_data.json`;
const targetId = JSON.parse(readFileSync(jsonPath, "utf8")).id;

// check targetId/img/players
const playerImages = [];
const playerPath = `./${config.target_id}/img/players`;
readdirSync(playerPath).forEach((file) => {
  playerImages.push(file);
});

const teamImages = [];
const teamPath = `./${config.target_id}/img/teams`;
readdirSync(teamPath).forEach((file) => {
  teamImages.push(file);
});

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });

  // uploading player images
  let i = 1;
  for (const player of playerImages) {
    console.log(`Uploading player ${i++}/${playerImages.length}`);
    const uploadResult = await cloudinary.uploader
      .upload(`${playerPath}/${player}`, {
        folder: `woozy/players`,
        public_id: player.split(".")[0],
      })
      .catch((error) => {
        console.log(error);
      });
  }

  i = 1;

  // uploading team images
  for (const team of teamImages) {
    console.log(`Uploading team ${i++}/${teamImages.length}`);
    const uploadResult = await cloudinary.uploader
      .upload(`${teamPath}/${team}`, {
        folder: `woozy/teams`,
        public_id: team.split(".")[0],
      })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log('Uploading event image...')
  // upload event image
  const uploadResult = await cloudinary.uploader
    .upload(`${targetId}/img/logo.webp`, {
      folder: `woozy/events`,
      public_id: targetId.toString(),
    })
    .catch((error) => {
      console.log(error);
    });

    console.log("All images uploaded!");
})();
