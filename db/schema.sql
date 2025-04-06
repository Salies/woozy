CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url_name TEXT NOT NULL,
    image_version INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    image_version INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url_name TEXT NOT NULL,
    image_version INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_event_rank (
    team_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    /*hltv_rank INTEGER NOT NULL,
    valve_rank INTEGER NOT NULL,*/
    rank INTEGER NOT NULL,
    PRIMARY KEY (team_id, event_id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE IF NOT EXISTS player_team_event (
    player_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    stats TEXT NOT NULL,
    PRIMARY KEY (player_id, team_id, event_id),
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);
