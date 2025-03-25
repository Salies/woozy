//import { Elysia, t } from 'elysia'
import { turso } from "./turso";
import { Row } from '@libsql/client/.';
//import { Event, EventSummary } from "./model";
import { Event } from "./model";

export const getAllEvents = async (): Promise<Row[]> => {
    const { rows } = await turso.execute("SELECT * FROM events ORDER BY datetime(created_at) DESC LIMIT 15");
    return rows;
}

export const getEvent = async (id: number) => {
    // check if the event exists
    const { rows } = await turso.execute("SELECT * FROM events WHERE id = $1", [id]);
    if (rows.length === 0) {
        throw new Error("Event not found");
    }
    
    /*const { rows: mainData } = await turso.execute(`
        SELECT 
            pte.player_id,
            p.name AS player_name,
            p.url_name AS player_url_name,
            pte.team_id,
            t.name AS team_name,
            t.url_name AS team_url_name,
            pte.event_id,
            e.name AS event_name,
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

    console.log(mainData[0]);*/
}