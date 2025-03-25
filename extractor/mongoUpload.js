import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { config } from "./config.js";

const eventId = config.target_id;
const eventData = JSON.parse(
  readFileSync(`${eventId}/event_data.json`, "utf8")
);
const eventTitle = readFileSync(`${eventId}/title.txt`, "utf8");

const playerData = {};

// cleaning up data
eventData.teams.forEach((team) => {
  delete team.image;
  team.rank = parseInt(team.rank);

  team.players.forEach((player) => {
    delete player.image;

    playerData[player.id] = {
      name: player.name,
      url_name: player.url_name,
    };

    // rename player.id to player.player_id
    player.player_id = player.id;
    delete player.id;
    delete player.name;
    delete player.url_name;
  });
});

const uri = "mongodb://localhost:27017"; // Update with your MongoDB connection string
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db(config.mongod.db_name); // Replace with your actual database name

    // insert players
    const playersCollection = database.collection("players");

    const playersArray = Object.entries(playerData).map(([id, player]) => ({
      _id: id, 
      ...player,
    }));

    // Step 1: Find existing players by _id
    const existingIds = playersArray.map((player) => player._id);
    const existingPlayers = await playersCollection
      .find({ _id: { $in: existingIds } })
      .toArray();
    const existingPlayerIds = existingPlayers.map((player) => player._id);

    // Step 2: Filter out players that already exist
    const playersToInsert = playersArray.filter(
      (player) => !existingPlayerIds.includes(player._id)
    );

    if (playersToInsert.length > 0) {
      // Insert only the players that do not exist
      const result = await playersCollection.insertMany(playersToInsert);
      console.log(`${result.insertedCount} players inserted`);
    } else {
      console.log("All players already exist");
    }

    // insert event
    const eventsCollection = database.collection("events");

    const event = {
      _id: eventId,
      title: eventTitle,
      teams: eventData.teams,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await eventsCollection.insertOne(event);
    console.log(`Event ${result.insertedId} inserted`);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
