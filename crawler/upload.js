import { v2 as cloudinary } from "cloudinary";
import { readdirSync, writeFileSync } from "fs";

import { config } from "dotenv";

config();

async function uploadImages() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const targetEvent = process.env.TARGET_EVENT_ID;
    console.log(`Uploading images for event ${targetEvent}.`);

    const eventPath = `data/events/${targetEvent}/img`;

    const imageVersions = {
        event: "",
        teams: {},
        players: {}
    };

    const eventUploadResult = await cloudinary.uploader
    .upload(`${eventPath}/logo.webp`, {
        folder: `woozy/events`,
        public_id: targetEvent,
    })
    .catch((error) => {
        console.log(error);
    });

    imageVersions.event = eventUploadResult.version

    console.log("Uploaded event logo.");

    const playerImages = readdirSync(`${eventPath}/players`).filter((file) => file.endsWith(".webp"));

    for (const file of playerImages) {
        const publicId = file.split(".")[0];
        const playerPath = `${eventPath}/players/${publicId}.webp`;
        const playerUploadResult = await cloudinary.uploader
            .upload(playerPath, {
                folder: `woozy/players`,
                public_id: publicId,
            })
            .catch((error) => {
                console.log(error);
            });

        imageVersions.players[publicId] = playerUploadResult.version;
        console.log(`Uploaded player ${publicId}.`);
    }

    const teamsImages = readdirSync(`${eventPath}/teams`).filter((file) => file.endsWith(".webp"));
    
    for (const file of teamsImages) {
        const publicId = file.split(".")[0];
        const teamPath = `${eventPath}/teams/${publicId}.webp`;
        const teamUploadResult = await cloudinary.uploader
            .upload(teamPath, {
                folder: `woozy/teams`,
                public_id: publicId,
            })
            .catch((error) => {
                console.log(error);
            });

        imageVersions.teams[publicId] = teamUploadResult.version;
        console.log(`Uploaded team ${publicId}.`);
    }

    // save versions to file
    const versionFilePath = `${eventPath}/imageVersions.json`;
    writeFileSync(versionFilePath, JSON.stringify(imageVersions, null, 4), "utf-8", (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("File written successfully");
        }
    });

    console.log("All images uploaded and versions saved to file.");
}

uploadImages();