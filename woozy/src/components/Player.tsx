import { Player } from "../dtos/Player";
import { formatPrice } from "./utils"
import { buildCloudinaryUrl } from "./Cloudinary";
import { useState, useContext } from "preact/hooks";
import { PicksAndBans } from "./PicksAndBansContext";

interface PlayerProps {
    data: Player;
    initialStatus?: number;
    /*locked?: boolean;*/
}

export function PlayerComponent(props: PlayerProps) {
    const player = props.data;

    const {
        picks, bans,
        addPlayerToPick, removePlayerFromPick,
        addPlayerToBan, removePlayerFromBan
    } = useContext(PicksAndBans);

    const [showStats, setShowStats] = useState(false);

    // status = 0; free
    // status = 1; locked
    // status = 2; removed
    let status = 0;
    if(picks.includes(player.id)){
        status = 1;
    } else if(bans.includes(player.id)){
        status = 2;
    }

    const toggleStats = () => {
        setShowStats(!showStats);
    };
    const lock = () => {
        if(status == 1){
            removePlayerFromPick(player.id);
            return;
        }
        addPlayerToPick(player.id);
    }

    const remove = () => {
        if(status == 2){
            removePlayerFromBan(player.id);
            return;
        }
        addPlayerToBan(player.id);
    }

    let imgSrc = "https://res.cloudinary.com/dzaaeb6yq/image/upload/v1743911431/0.png";
    if(player.id != -1) {
        imgSrc = buildCloudinaryUrl(player.image_version, "players", player.id);
    }

    return (
        <div>
            <div class="player-options">
                <div class="player-icon player-stats" onClick={toggleStats} />
                <div>
                    <div class={`player-icon ${status == 1 ? 'player-lock' : 'player-unlock'}`} onClick={lock}></div>
                    <div class="player-icon player-remove" onClick={remove}></div>
                </div>
            </div>
            <div class={`player ${status == 1 ? 'locked' : ''} ${status == 2 ? 'removed' : ''}`}>
                <>
                    <div class={`img-wrapper ${showStats ? 'opacity-0' : ''}`}>
                        <img 
                            src={imgSrc}
                            alt="player"
                        />
                    </div>
                    <p class={`player-text ${showStats ? 'opacity-0' : ''}`}><b>{player.name}</b></p>
                    <p class={`player-text ${showStats ? 'opacity-0' : ''}`}>${formatPrice(player.price)}</p>
                </>
                <div class={`player-stats-content ${showStats ? '' : 'hidden'}`}>
                    <div class="player-stats-grid">
                        <div class="player-stats-item">Rating</div>
                        <div class="player-stats-item">{player.stats.rating}</div>
                        <div class="player-stats-item">CT rating</div>
                        <div class="player-stats-item">{player.stats.ct_rating}</div>
                        <div class="player-stats-item">T rating</div>
                        <div class="player-stats-item">{player.stats.t_rating}</div>
                        <div class="player-stats-item">AWP</div>
                        <div class="player-stats-item">{player.stats.awp}</div>
                        <div class="player-stats-item">HS %</div>
                        <div class="player-stats-item">{player.stats.hs}</div>
                        <div class="player-stats-item">Entry</div>
                        <div class="player-stats-item">{player.stats.entry_rounds}</div>
                        <div class="player-stats-item">Clutch</div>
                        <div class="player-stats-item">{player.stats.clutch_rounds}</div>
                        <div class="player-stats-item">Support</div>
                        <div class="player-stats-item">{player.stats.support_rounds}</div>
                        <div class="player-stats-item">Multi kill</div>
                        <div class="player-stats-item">{player.stats.mk_rounds}</div>
                        <div class="player-stats-item">DPR</div>
                        <div class="player-stats-item">{player.stats.dpr}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
