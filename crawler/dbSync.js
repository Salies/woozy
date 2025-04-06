import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { config } from 'dotenv';

config();

// dev
/*const turso = createClient({
    url: "file:data/local.db",
});*/

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// load cloudinary image versions
const imageVersions = JSON.parse(readFileSync(`data/events/${process.env.TARGET_EVENT_ID}/img/imageVersions.json`, "utf-8"));

// load all data
const eventData = JSON.parse(readFileSync(`data/events/${process.env.TARGET_EVENT_ID}/event.json`, "utf-8"));
const playerData = JSON.parse(readFileSync(`data/events/${process.env.TARGET_EVENT_ID}/players.json`, "utf-8"));
const teamData = JSON.parse(readFileSync(`data/events/${process.env.TARGET_EVENT_ID}/teams.json`, "utf-8"));

await turso.execute({
    sql: "INSERT OR IGNORE INTO events (id, name, image_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    args: [
        eventData.id,
        eventData.name,
        imageVersions.event,
        new Date().toISOString(),
        new Date().toISOString()
    ]
});

console.log("Event inserted.");

const teamBatch = [];

for (const team of teamData) {
    teamBatch.push(
        {
            sql: "INSERT OR REPLACE INTO teams (id, name, url_name, image_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            args:[
                team.id,
                team.name,
                team.url_name,
                imageVersions["teams"][team.id],
                new Date().toISOString(),
                new Date().toISOString()
            ]
        }
    );

    const rank = parseInt(team.hltv_rank.replace("#", ""));
    teamBatch.push(
        {
            sql: "INSERT OR IGNORE INTO team_event_rank (team_id, event_id, rank) VALUES (?, ?, ?)",
            args:[
                team.id,
                eventData.id,
                rank
            ]
        }
    );

    // add team info to player
    for (const teamPlayerId of team.players) {
        // filter playerData to find the player with the same id
        const player = playerData.find(player => player.id === teamPlayerId);
        // add "team" property to player
        if (player) {
            player.team = team.id;
        }
    }
}

await turso.batch(teamBatch);
console.log("Teams inserted.");

const playerBatch = [];

for (const player of playerData) {
    const fmtStats = {
        rating: parseFloat(player.stats.rating),
        ct_rating: parseFloat(player.stats.ct_rating),
        t_rating: parseFloat(player.stats.t_rating),
        awp: parseFloat(player.stats.awp),
        hs: parseFloat(player.stats.hs.replace("%", "")),
        entry_rounds: parseFloat(player.stats.entry_rounds.replace("%", "")),
        clutch_rounds: parseFloat(player.stats.clutch_rounds.replace("%", "")),
        support_rounds: parseFloat(player.stats.support_rounds.replace("%", "")),
        mk_rounds: parseFloat(player.stats.mk_rounds.replace("%", "")),
        dpr: parseFloat(player.stats.dpr),
    };

    playerBatch.push(
        {
            sql: "INSERT OR REPLACE INTO players (id, name, url_name, image_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            args:[
                player.id,
                player.name,
                player.url_name,
                imageVersions["players"][player.id],
                new Date().toISOString(),
                new Date().toISOString()
            ]
        }
    );

    playerBatch.push(
        {
            sql: "INSERT OR REPLACE INTO player_team_event (player_id, team_id, event_id, price, stats) VALUES (?, ?, ?, ?, ?)",
            args:[
                player.id,
                player.team,
                eventData.id,
                parseInt(player.price.replace("$", "").replace(",", "")),
                JSON.stringify(fmtStats)
            ]
        }
    );
}

await turso.batch(playerBatch);
console.log("Players inserted.");

// TODO: update image version if row already exists