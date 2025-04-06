import { createContext } from "preact";

interface PicksAndBansContext {
    picks: number[]; // player ids
    bans: number[]; // player ids
    addPlayerToPick: (playerId: number) => void;
    removePlayerFromPick: (playerId: number) => void;
    addPlayerToBan: (playerId: number) => void;
    removePlayerFromBan: (playerId: number) => void;
}

export const PicksAndBans = createContext<PicksAndBansContext>({
    picks: [],
    bans: [],
    addPlayerToPick: () => {},
    removePlayerFromPick: () => {},
    addPlayerToBan: () => {},
    removePlayerFromBan: () => {}
});