import { NotFoundError } from "elysia";
import { turso } from "./turso";
import { Row } from '@libsql/client/.';
import { Event, Team, Player, PlayerStats } from "./model";

export const getAllEvents = async (): Promise<Row[]> => {
    const { rows } = await turso.execute("SELECT * FROM events ORDER BY datetime(created_at) DESC LIMIT 15");
    return rows;
}

export const getEvent = async (id: number): Promise<Event> => {
    // check if the event exists
    const { rows } = await turso.execute("SELECT * FROM events WHERE id = $1", [id]);
    if (rows.length === 0) {
        throw new NotFoundError("Event not found");
    }
    
    const { rows: mainData } = await turso.execute(`
        SELECT 
            pte.player_id,
            p.name AS player_name,
            p.url_name AS player_url_name,
            pte.team_id,
            t.name AS team_name,
            t.url_name AS team_url_name,
            pte.event_id,
            e.name AS event_name,
            e.created_at as created_at,
            e.updated_at as updated_at,
            pte.price,
            pte.stats,
            ter.rank AS team_rank
        FROM player_team_event pte
        JOIN players p ON pte.player_id = p.id
        JOIN teams t ON pte.team_id = t.id
        JOIN events e ON pte.event_id = e.id
        LEFT JOIN team_event_rank ter ON pte.team_id = ter.team_id AND pte.event_id = ter.event_id
        WHERE pte.event_id = ?;
    `, [id]);

    // building event object from data
    const event: Event = {
        id: mainData[0].event_id as number,
        name: mainData[0].event_name as string,
        created_at: new Date(mainData[0].created_at as string),
        updated_at: new Date(mainData[0].updated_at as string),
        teams: []
    };

    const teams = new Map<number, Team>();

    // loop through rows
    for (let i = 0; i < mainData.length; i++) {
        const row = mainData[i];

        const teamId = row.team_id as number;

        if(!teams.has(teamId)) {
            const team: Team = {
                id: teamId,
                name: row.team_name as string,
                url_name: row.team_url_name as string,
                rank: row.team_rank as number,
                players: []
            };

            teams.set(teamId, team);
        }

        const team = teams.get(teamId) as Team;

        const playerStats: PlayerStats = JSON.parse(row.stats as string);

        const player: Player = {
            id: row.player_id as number,
            name: row.player_name as string,
            url_name: row.player_url_name as string,
            price: row.price as number,
            stats: playerStats
        };

        team.players.push(player);
    }

    // map teams to event array
    event.teams = Array.from(teams.values());

    return event;
}