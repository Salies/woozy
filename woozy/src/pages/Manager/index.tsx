import { useLocation } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';
import { buildCloudinaryUrl } from '../../components/Cloudinary';
import { event } from './test_data';
import { Player } from '../../components/Player';
import './style.css';

const playerimg = buildCloudinaryUrl(1742963179, "players", 21167);

export function Manager() {
    const location = useLocation();
    console.log(location.query)

    // if no event id, redirect to 404
    if (!location.query.event_id) {
        window.location.href = '/404';
        return null;
    }

    const event_id = location.query.event_id;
    const api_url = import.meta.env.VITE_API_URL;

    /*const [event, setEvent] = useState(null);

    useEffect(() => {
        fetch(`${api_url}/events/${event_id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setEvent(data);
            })
            .catch(err => {
                console.error(err);
                window.location.href = '/404';
            });
    }
        , [event_id, api_url]);*/

    // If event is not yet loaded, show a loading state or return null
    if (!event) {
        return <span aria-busy="true">Loading evnet data...</span>;
    }

    return (
        <div class="event-container">
            <div class="event-title">
                <img
                    class="event-image"
                    src={buildCloudinaryUrl(event.image_version, "events", event.id)}
                    alt={event.name}
                />
                <h2>{event.name}</h2>
            </div>
            <article>
                <div class="your-team-title">
                    <h3 style={`font-weight:300`}>your team</h3>
                    <button>optimize</button>
                </div>
                <div class="grid team">
                    <Player name="donk" image={playerimg} price={270_000} />
                    <Player name="donk" image={playerimg} price={270_000} />
                    <Player name="donk" image={playerimg} price={270_000} />
                    <Player name="donk" image={playerimg} price={270_000} />
                    <Player name="donk" image={playerimg} price={270_000} />
                </div>
            </article>
        </div>
    );
}
