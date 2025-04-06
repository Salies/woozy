import { useEffect, useState } from "preact/hooks";
import { buildCloudinaryUrl } from "../../components/Cloudinary";
import { EventListItem } from "../../dtos/Event";
import "./style.css";

export function EventList() {
    const [eventListData, setEventListData] = useState<EventListItem[] | null>(null);

    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${api_url}/events`)
            .then(res => res.json())
            .then(setEventListData)
            .catch(err => {
                console.error("Failed to fetch events", err);
                setEventListData([]);
            });
    }, []);

    if (!eventListData) {
        return <span aria-busy="true">Loading event list...</span>;
    }

    return <div class="event-list">
        {eventListData.map(event => <EventCard key={event.id} {...event} />)}
    </div>;
}

function EventCard(event: EventListItem) {
    return <a href={`./manager?event_id=${event.id}`} class="event-card-a">
        <article class="event-card">
            <img src={buildCloudinaryUrl(event.image_version, "events", event.id)} alt={event.name} />
            <hgroup>
                <h4>{event.name}</h4>
                <time>Added in: {new Date(event.created_at).toLocaleString()}</time>
                <time>Last updated: {new Date(event.updated_at).toLocaleString()}</time>
            </hgroup>
        </article>
    </a>;
}
