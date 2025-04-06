import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Event } from "../../dtos/Event";
import { buildCloudinaryUrl } from "../../components/Cloudinary";
import { TeamComponent } from "../../components/Team";
import { PicksAndBans } from "../../components/PicksAndBansContext";
import { PlayerComponent } from "../../components/Player";
import { formatPrice } from "../../components/utils";
import { Player } from "../../dtos/Player";
import { optimize } from './optimizer';
import toast, { Toaster } from 'react-hot-toast';
import './style.css';

const hiddenPlayer: Player = {
    id: -1,
    name: "hidden",
    url_name: "hidden",
    image_version: 1743911176,
    price: 0,
    stats: {
        rating:0,
        ct_rating:0,
        t_rating:0,
        awp:0,
        hs:0,
        entry_rounds:0,
        clutch_rounds:0,
        support_rounds:0,
        mk_rounds:0,
        dpr:0,
    },
}

function optimizeCallback(
    eventData: Event,
    bannedPlayers: number[],
    lockedPlayers: number[],
    budget: number,
    setPicks: (players: number[]) => void
) {
    const response = optimize(eventData, bannedPlayers, lockedPlayers, budget);
    if (!response.success) {
        toast.error(response.message, {position: "top-right"});
        return;
    }

    toast.success(response.message, {position: "top-right"});

    const newPicks = [...lockedPlayers, ...response.players];
    setPicks(newPicks);
    return;
}

export function Manager() {
    // loading base data
    const [eventData, setEventData] = useState<Event | null>(null);

    const location = useLocation();
    if (!location.query.event_id) {
        window.location.href = '/404';
        return null;
    }

    const event_id = location.query.event_id;

    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log("Fetching event data...");
        fetch(`${api_url}/events/${event_id}`)
            .then(res => res.json())
            .then(setEventData)
            .catch(err => {
                console.error("Failed to fetch events", err);
                setEventData(null);
            });
    }, []);

    if (!eventData) {
        return <span aria-busy="true">Loading event data...</span>;
    }

    const fullPlayerMap = new Map<number, Player>();
    eventData.teams.forEach((team) => {
        team.players.forEach((player) => {
            fullPlayerMap.set(player.id, player)
        });
    });

    // picks and bans logic
    const [picks, setPicks] = useState<number[]>([]);
    const [bans, setBans] = useState<number[]>([]);

    const totalSpent = picks.reduce((acc, playerId) => {
        const player = fullPlayerMap.get(playerId);
        if (!player) {
            return acc;
        }
        return acc + player.price;
    }
    , 0);

    // TODO: check if there's at least 5 players to form a team
    // (this is, you can't ban practically everyone)
    const addPlayerToBan = (playerId: number) => {
        if (picks.includes(playerId)) {
            setPicks(picks.filter((id) => id !== playerId));
        }
        setBans([...bans, playerId]);
    }

    const removePlayerFromBan = (playerId: number) => {
        if (bans.length == 0) {
            return;
        }
        setBans(bans.filter((id) => id !== playerId));
    }

    const addPlayerToPick = (playerId: number) => {
        if (picks.length >= 5) {
            return;
        }

        if (picks.includes(playerId)) {
            return;
        }

        // check if there's still money left
        if(fullPlayerMap.get(playerId)?.price > 1_000_000 - totalSpent){
            toast.error("Not enough money left.", {position: "top-right"});
            return;
        }

        if (bans.includes(playerId)) {
            setBans(bans.filter((id) => id !== playerId));
        }
        setPicks([...picks, playerId]);
    }

    const removePlayerFromPick = (playerId: number) => {
        if (picks.length == 0) {
            return;
        }
        setPicks(picks.filter((id) => id !== playerId));
    }

    let money = 1_000_000;
    money -= totalSpent;
    const moneyLeft = formatPrice(money);

    return <PicksAndBans.Provider value={
        { 
            picks: picks,
            bans: bans,
            addPlayerToPick: addPlayerToPick,
            removePlayerFromPick: removePlayerFromPick,
            addPlayerToBan: addPlayerToBan,
            removePlayerFromBan: removePlayerFromBan
        }
    }>
        <div class="event-container">
            <div class="event-title">
                <img
                    class="event-image"
                    src={buildCloudinaryUrl(eventData.image_version, "events", eventData.id)}
                    alt={eventData.name}
                />
                <h2>{eventData.name}</h2>
            </div>
            {/* players team */}
            <article>
                <div class="your-team-title">
                    <h3 style={`font-weight:300`}>your team</h3>
                    <div>
                        <span class="total-team-money">${moneyLeft}</span>
                        <button onClick={() => optimizeCallback(eventData, bans, picks, money, setPicks)}>optimize</button>
                    </div>
                </div>
                <div class="grid team">
                    {picks.map((playerId) => {
                        const player = fullPlayerMap.get(playerId);
                        if (!player) {
                            return <PlayerComponent data={null}/>
                        }
                        return <PlayerComponent data={player} initialStatus={1} />;
                    })}
                    {/* fill the rest with null components */}
                    {[...Array(5 - picks.length)].map(() =>
                        <div class="hidden-player">
                            <PlayerComponent data={hiddenPlayer} />
                        </div>
                    )}
                </div>
            </article>
            {/* teams */}
            
                {
                    eventData.teams.map((team) => {
                        return <TeamComponent data={team} />;
                    })
                }
            
        </div>
        <Toaster />
    </PicksAndBans.Provider>;
}