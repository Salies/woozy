import { createClient } from "@libsql/client";
import dotenv from 'dotenv'
import { readFileSync } from 'fs';

dotenv.config()

/*export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});*/

// DEV: local db
const turso = createClient({
    url: "file:local.db",
});

// read json
const jsonData = JSON.parse(readFileSync(`../${process.env.TARGET_ID}/event_data_hydra.json`, "utf8"));
const imageVersions = JSON.parse(readFileSync(`../${process.env.TARGET_ID}/image_versions.json`, "utf8"));
const eventTtile = readFileSync(`../${process.env.TARGET_ID}/title.txt`, "utf8");

// insert event first
const eventInsertion = await turso.execute(
    'INSERT OR IGNORE INTO events (id, name, image_version) VALUES (?, ?, ?)',
    [jsonData.id, eventTtile, imageVersions["events"][jsonData.id]]
);
console.log('Event Insertion:', eventInsertion);

// then insert teams
const teamsInsertBatch = [];
jsonData.teams.forEach(team => {
    teamsInsertBatch.push({
        sql: 'INSERT OR IGNORE INTO teams (id, name, url_name, image_version) VALUES (?, ?, ?, ?)',
        args: [team.id, team.name, team.url_name, imageVersions["teams"][team.id]]
    });
    // while on it, insert players
    team.players.forEach(player => {
        teamsInsertBatch.push({
            sql: 'INSERT OR IGNORE INTO players (id, name, url_name, image_version) VALUES (?, ?, ?, ?)',
            args: [player.id, player.name, player.url_name, imageVersions["players"][player.id]]
        });
    });
});

const teamsInsertion = await turso.batch(teamsInsertBatch);
console.log('Teams Insertion:', teamsInsertion);

// now that we have all ids, do one final loop inserting event data
const detailsInsertBatch = [];
jsonData.teams.forEach(team => {
    team.players.forEach(player => {
        detailsInsertBatch.push({
            sql: 'INSERT OR IGNORE INTO player_team_event (player_id, team_id, event_id, price, stats) VALUES (?, ?, ?, ?, ?)',
            args: [player.id, team.id, jsonData.id, player.price, JSON.stringify(player.stats)]
        });
    });

    // inser team rank
    detailsInsertBatch.push({
        sql: 'INSERT OR IGNORE INTO team_event_rank (team_id, event_id, rank) VALUES (?, ?, ?)',
        args: [team.id, jsonData.id, team.rank]
    });
});

const detailsInsertion = await turso.batch(detailsInsertBatch);
console.log('Details Insertion:', detailsInsertion);