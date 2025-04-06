import { Event } from "../../dtos/Event";
import { solve, lessEq, equalTo, Constraint } from "yalps";

interface OptimizerAnswer {
    success: boolean;
    message?: string;
    players?: number[];
}

export function optimize(eventData: Event, bannedPlayers: number[], lockedPlayers: number[], budget: number): OptimizerAnswer {
    const reducedPlayerData = new Map<string, { rating: number, price: number, slot: number }>();
    for (const team of eventData.teams) {
        for(const player of team.players) {
            // if player is banned, ignore
            if (bannedPlayers.includes(player.id) || lockedPlayers.includes(player.id)) {
                continue;
            }

            reducedPlayerData.set(String(player.id), {
                rating: player.stats.rating,
                price: player.price,
                slot: 1
            });
        }
    }

    const nSlots = 5 - lockedPlayers.length;

    // check if the problem is feasible:
    // if there's at least nSlots buyable players left

    // get nSlots cheapest players
    const cheapestPriceSum = [...reducedPlayerData.values()]
        .sort((a, b) => a.price - b.price)
        .slice(0, nSlots)
        .reduce((acc, player) => acc + player.price, 0);

    if (cheapestPriceSum > budget) {
        return {
            success: false,
            message: "Not enough money to complete the team.",
        };
    }

    // build optimization model
    const constraints = new Map<string, Constraint>()
        .set("slot", equalTo(nSlots))
        .set("price", lessEq(budget));

    const model = {
        direction: "maximize" as const,
        objective: "rating",
        constraints: constraints,
        variables: reducedPlayerData,
        binaries: true // only one of each player can be selected
    }
        
    const solution = solve(model)

    if (solution.status !== "optimal") {
        return {
            success: false,
            message: "No optimal team found.",
        }
    }

    const selectedPlayers = solution.variables.map(player => Number(player[0]));

    return {
        success: true,
        players: selectedPlayers,
        message: "Optimal team found!",
    }
}