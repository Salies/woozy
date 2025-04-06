import { Player } from "./Player";

export type Team = {
    id: number;
    name: string;
    url_name: string;
    image_version: number;
    rank: number;
    players: Player[];
};