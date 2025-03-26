import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";
import { readFileSync, readdirSync, writeFile } from "fs";

const jsonPath = `./${config.target_id}/event_data.json`;
const targetId = JSON.parse(readFileSync(jsonPath, "utf8")).id;

// check targetId/img/players
const playerImages = [];
const playerPath = `./${targetId}/img/players`;
readdirSync(playerPath).forEach((file) => {
  playerImages.push(file);
});

const teamImages = [];
const teamPath = `./${targetId}/img/teams`;
readdirSync(teamPath).forEach((file) => {
  teamImages.push(file);
});

// store versions for later use
const imageVersions = {
  players:{},
  teams:{},
  events:{}
}

async function uploadImages() {
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
    const public_id = player.split(".")[0];
    const uploadResult = await cloudinary.uploader
      .upload(`${playerPath}/${player}`, {
        folder: `woozy/players`,
        public_id: public_id,
      })
      .catch((error) => {
        console.log(error);
    });

    imageVersions.players[public_id] = uploadResult.version
  }

  i = 1;

  // uploading team images
  // TODO: use hydrated version
  for (const team of teamImages) {
    console.log(`Uploading team ${i++}/${teamImages.length}`);
    const public_id = team.split(".")[0];
    const uploadResult = await cloudinary.uploader
      .upload(`${teamPath}/${team}`, {
        folder: `woozy/teams`,
        public_id: public_id,
      })
      .catch((error) => {
        console.log(error);
    });

    imageVersions.teams[public_id] = uploadResult.version
  }

  console.log('Uploading event image...')
  const event_public_id = targetId.toString();
  // upload event image
  const uploadResult = await cloudinary.uploader
    .upload(`${targetId}/img/logo.webp`, {
      folder: `woozy/events`,
      public_id: event_public_id,
    })
    .catch((error) => {
      console.log(error);
    });

  imageVersions.events[event_public_id] = uploadResult.version

  console.log("All images uploaded!");

  // write versions to file
  const versionsPath = `./${targetId}/image_versions.json`;
  const versions = JSON.stringify(imageVersions, null, 2);
  writeFile(versionsPath, versions, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

uploadImages();
