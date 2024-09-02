// Preventing refreshing when forms are being submitted

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("loader").style.display = "none";
document.getElementById("content").style.display = "block";

// Calling the API

  const apiKey = "1a4b4351a7a920a7e7a90bf1f3b2a054s";
  const region = "uk";
  const market = "h2h";

  function fetchAndDisplayAllMatches(league, containerId) {
    fetch(
      `https://api.the-odds-api.com/v4/sports/${league}/odds?markets=${market}&regions=${region}&apiKey=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not okay: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (data.length === 0) {
          console.log(`No data available for league: ${league}`);
          return;
        }

        data.forEach((matchData) => {
          const h2hMarket = matchData.bookmakers[4].markets.find(
            (market) => market.key === "h2h"
          );

          const matchDiv = document.createElement("div");
          matchDiv.className = "match";

          matchDiv.innerHTML = `
            <h3>${matchData.sport_title}</h3>
            <div class='gameDetails'>
              <p><strong>Home Team:</strong> ${matchData.home_team}</p>
              <p><strong>Away Team:</strong> ${matchData.away_team}</p>
              <p><strong>Commence Time:</strong> ${matchData.commence_time}</p>
            </div>
            <div class='oddsButtons'>
              <p class='btn'>${h2hMarket.outcomes[0].price}</p>
              <p class='btn'>${h2hMarket.outcomes[1].price}</p>
              <p class='btn'>${h2hMarket.outcomes[2].price}</p> 
            </div>
          `;

          container.appendChild(matchDiv);
        });
      })
      .catch((error) => {
        console.log("There was a problem with the fetch operation:", error);
      });
  }

  fetchAndDisplayAllMatches("soccer_epl", "eplMatchesContainer");
  fetchAndDisplayAllMatches(
    "soccer_germany_bundesliga",
    "bundesligaMatchesContainer"
  );
  fetchAndDisplayAllMatches("soccer_spain_la_liga", "laLigaMatchesContainer");
  fetchAndDisplayAllMatches("soccer_italy_serie_a", "serieAMatchesContainer");
  fetchAndDisplayAllMatches(
    "soccer_france_ligue_one",
    "ligue1MatchesContainer"
  );

  // Event delegation for buttons and ticket calculator

  const content = document.getElementById("content");
  let sum = 0;

  content.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn")) {
      const button = event.target;
      button.classList.toggle("selected");
      button.style.backgroundColor = "var(--yellow)";
      button.style.color = " black";

      const selectedItems = [];
      sum = 0;

      document.querySelectorAll(".btn.selected").forEach((btn) => {
        selectedItems.push(btn.textContent);
        sum += parseFloat(btn.textContent);
      });

      document.getElementById("display").textContent = selectedItems.join(", ");
      document.getElementById("total").textContent = sum.toFixed(2);

      document.getElementById("ticket").style.display = selectedItems.length
        ? "block"
        : "none";
    }

    if (event.target.id === "clearBtn") {
      document.getElementById("total").textContent = 0;
      document.getElementById("display").textContent = 0;
      sum = 0;
      document.getElementById("ticket").style.display = "none";

      document.querySelectorAll(".btn.selected").forEach((button) => {
        button.classList.remove("selected");
        button.style.backgroundColor = "var(--bgTicket)";
        button.style.color = "var(--fontColour)";
      });
    }
  });

  // Modal #1 (Ticket Details)

  document.getElementById("winsCalc").addEventListener("submit", (event) => {
    event.preventDefault();

    const userInput = document.getElementById("payInput").value;
    if (userInput === "") {
      alert("Please enter a valid amount");
    } else {
      document.getElementById(
        "userAmount"
      ).textContent = `Wager Amount: ${userInput}`;

      document.getElementById(
        "modalTotalOdds"
      ).textContent = `Total number of odds: ${sum.toFixed(2)}`;

      const expectedReturn = userInput * sum;

      document.getElementById(
        "expectedReturn"
      ).textContent = `Expected Return: ${expectedReturn.toFixed(2)}`;

      const modal = document.getElementById("modal");
      const submitTicket = document.getElementById("submitTicket");
      const closeModal = document.getElementById("closeModal");

      submitTicket.addEventListener("click", () => {
        modal.style.display = "block";
      });

      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  });

  // Modal #2 (Success on bet placement)

  const openModal2 = document.getElementById("betConfirm");
  const modal2 = document.getElementById("modal2");
  const closeModal2 = document.getElementById("closeModal2");

  openModal2.addEventListener("click", () => {
    modal2.style.display = "block";
    document.getElementById("modal").style.display = "none";
  });

  closeModal2.addEventListener("click", () => {
    modal2.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal2) {
      modal2.style.display = "none";
    }
  });
});

// Changing the colour of selected filter elements

function changeColour() {
  const filterItem = document.querySelectorAll(".filterItem");

  filterItem.forEach((item) => {
    item.addEventListener("click", () => {
      filterItem.forEach((item) => {
        item.style.color = "";
      });

      item.style.color = "var(--green)";
    });
  });
}

changeColour();
