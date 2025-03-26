import { t } from "elysia";

const stats = t.Object({
    rating: t.Numeric(),
    ct_rating: t.Numeric(),
    t_rating: t.Numeric(),
    awp_rating: t.Numeric(),
    hs_percentage: t.Numeric(),
    entry_rounds_percentage:t.Numeric(),
    clutch_rounds_percentage:t.Numeric(),
    support_rounds_percentage: t.Numeric(),
    multi_kill_rounds_percentage: t.Numeric(),
    deaths_per_round: t.Numeric(),
});

const player = t.Object({
    id: t.Numeric(),
    name: t.String(),
    url_name: t.String(),
    price: t.Numeric(),
    stats: stats,
});

const team = t.Object({
    id: t.Numeric(),
    name: t.String(),
    url_name: t.String(),
    rank: t.Numeric(),
    players: t.Array(player),
});

const eventSummary = t.Object({
    id: t.Numeric(),
    name: t.String(),
    created_at: t.String(),
    updated_at: t.String(),
});

const event = t.Object({
    id: t.Numeric(),
    name: t.String(),
    teams: t.Array(team),
    created_at: t.Date(),
    updated_at: t.Date(),
});

const Validation = {
    event,
    eventSummary
}

type Event = typeof event.static
type EventSummary = typeof eventSummary.static
type Team = typeof team.static
type Player = typeof player.static
type PlayerStats = typeof stats.static

export { Validation, Event, EventSummary, Team, Player, PlayerStats }