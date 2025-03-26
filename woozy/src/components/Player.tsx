function formatPrice(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface PlayerProps {
    name: string;
    price: number;
    image: string;
    locked?: boolean;
}

export function Player(props: PlayerProps) {
    return (
        <div>
            <div class="player-options">
                <div class="player-icon player-stats" />
                <div>
                    <div class={`player-icon ${typeof props.locked !== "undefined" ? 'player-lock' : 'player-unlock'}`}></div>
                    <div class="player-icon player-remove"></div>
                </div>
            </div>
            <div class="player">
                <div class="img-wrapper"><img src={props.image} alt="player" /></div>
                <p><b>{props.name}</b></p>
                <p>${formatPrice(props.price)}</p>
            </div>
        </div>
    );
}
