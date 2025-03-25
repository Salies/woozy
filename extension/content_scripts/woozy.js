const statNameMap = {
  Rating: "rating",
  "CT rating": "ct_rating",
  "T rating": "t_rating",
  AWP: "awp_rating",
  "HS %": "hs_percentage",
  "Entry rounds": "entry_rounds_percentage",
  "Clutch rounds": "clutch_rounds_percentage",
  "Support rounds": "support_rounds_percentage",
  "Multi kill rounds": "multi_kill_rounds_percentage",
  "Deaths per round": "deaths_per_round",
};

function getData() {
  const eventId = window.location.href.split("/").slice(0, 5)[4];

  const fullEventData = {
    id: eventId,
    teams: [],
  };

  const teams = document.querySelectorAll(".teamCon");

  teams.forEach((team) => {
    // get team basic data (logo, name and rank)
    const teamLogo = team.querySelector(".teamLogo").src;
    const teamName = team.querySelector(".teamName").innerText;
    let teamRank = team.querySelector(".teamRank").innerText;
    // split, get first
    teamRank = teamRank.split(" ")[0].replace("#", "");
    const teamData = {
      name: teamName,
      image: teamLogo,
      rank: teamRank,
      players: [],
    };

    const players = team.querySelectorAll(".teamPlayer");
    players.forEach((player) => {
      const playerImg = player.querySelector(".player-picture").src;
      const playerName = player.querySelector(".card-player-tag").innerText;
      let playerPrice = player.querySelector(".playerButtonText").innerText;
      playerPrice = parseInt(playerPrice.replace("$", "").replace(",", ""));

      console.log("cheguei aqui")

      // deeper info
      const playerStatsUrl = player.querySelector(".player-stats-link").href.split("/");
      const playerUrlName = playerStatsUrl[6].split("?")[0];
      const playerId = playerStatsUrl[5];

      const playerStatsEl = player.querySelectorAll(".stat-flex");
      const playerStats = {};
      playerStatsEl.forEach((stat) => {
        const statNameRaw = stat.querySelector(".back-desc").innerText;
        const statValue = parseFloat(
          stat.querySelector(".back-value").innerText
        );
        const statName = statNameMap[statNameRaw];
        playerStats[statName] = statValue;
      });

      teamData.players.push({
        id: playerId,
        url_name: playerUrlName,
        name: playerName,
        image: playerImg,
        price: playerPrice,
        stats: playerStats,
      });
    });

    fullEventData.teams.push(teamData);
  });
  
  // save as json
  const dataStr = JSON.stringify(fullEventData, null, 2);

  const a = document.createElement("a");
  const file = new Blob([dataStr], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = "event_data.json";
  a.click();
}

browser.runtime.onMessage.addListener((message) => {
  if (message.command === "extract") {
    getData();
  }
});
