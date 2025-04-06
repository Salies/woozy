import { Team } from "./Team";

export type EventListItem = {
    id: number;
    name: string;
    image_version: number;
    created_at: string;
    updated_at: string;
}

export type Event = {
    id: number;
    name: string;
    image_version: number;
    created_at: string;
    updated_at: string;
    teams: Team[];
}