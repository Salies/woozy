import { Team } from "../dtos/Team";
import { PlayerComponent } from "./Player";
import { buildCloudinaryUrl } from "./Cloudinary";

export function TeamComponent(props: { data: Team }) {
  const { data } = props;

  return (
    <details open>
      <summary role="button" class="fantasy-team">
        <div>
          <img src={buildCloudinaryUrl(data.image_version, "teams", data.id)} />
          {data.name} <span>(#{data.rank})</span>
        </div>
      </summary>
      <div class="grid team">
        {data.players.map((player) => {
          return (
            <div class="player-wrapper">
              <PlayerComponent data={player} />
            </div>
          );
        })}
      </div>
    </details>
  );
}
