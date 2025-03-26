import { buildCloudinaryUrl } from "../../components/Cloudinary";
import { EventListItem } from "../../dtos/Event";
import "./style.css";

export function EventList() {
    const eventListData: EventListItem[] = [
        {
            id: 519,
            name: "Playoffs - BLAST Open Lisbon 2025",
            image_version: 1742963200,
            created_at: "2025-03-25 20:06:24",
            updated_at: "2025-03-25 20:06:24",
        }
    ];

    return <div class="event-list">
        {eventListData.map(event => <EventCard {...event} />)}
    </div>
}

function EventCard(event: EventListItem) {
    return <a href={`./manager?event_id=${event.id}`} class="event-card-a">
        <article class="event-card">
            <img src={buildCloudinaryUrl(event.image_version, "events", event.id)} alt={event.name} />
            <hgroup>
                <h4>{event.name}</h4>
                <time>Added in: {new Date(event.created_at).toLocaleString()}</time>
                <time>Last upated: {new Date(event.updated_at).toLocaleString()}</time>
            </hgroup>
        </article>
    </a>
}