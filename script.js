document.addEventListener("DOMContentLoaded", function () {
  const coinCardContainer = document.getElementById("coinCardContainer");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const selectedCoinsContainer = document.getElementById("selectedCoins");

  let selectedCoinsArray = [];
  let data = [];
  const selectedCoins = new Set();
  const coinsToShow = 5;
  // let selectedCoinId; // Variable to store the selected coin ID
  
  // Function to save the selected coins into an array
  function saveSelectedCoinsToArray() {
    selectedCoinsArray = Array.from(selectedCoins);
  }

  // Fetch data from API and display coins on the page
  fetchCoins();

  async function fetchCoins() {
    try {
      const response = await fetch("markets.json"); // Replace with the actual API URL
      data = await response.json();
      saveSelectedCoinsToArray();
      createCoinCards(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function createCoinCards(data) {
    coinCardContainer.innerHTML = ""; // Clear the container
    data.forEach((item) => {
      const coinCard = createCoinCard(item);
      coinCardContainer.appendChild(coinCard);
    });
  }

  function createCoinCard(item) {
    const coinCard = document.createElement("div");
    coinCard.classList.add("coin-card");
    coinCard.id = `coin-${item.id}`;

    const toggleButton = document.createElement("div");
    toggleButton.classList.add("container");

    const toggleDiv = document.createElement("div");
    toggleDiv.classList.add("toggle");
    toggleDiv.addEventListener("click", () => toggle(item));

    const circleDiv = document.createElement("div");
    circleDiv.classList.add("circle");

    const textSpan = document.createElement("span");
    textSpan.classList.add("text");
    textSpan.id = `toggle-${item.id}`;
    textSpan.innerHTML = selectedCoins.has(item.id) ? "ON" : "OFF";
    if (selectedCoins.has(item.id)) {
      textSpan.classList.add("active");
    }

    toggleDiv.appendChild(circleDiv);
    toggleDiv.appendChild(textSpan);
    toggleButton.appendChild(toggleDiv);

    const coinCardTable = document.createElement("table");
    coinCardTable.classList.add("coinTable");

    const coinTableTitle = createTableRow("coinTableRow", "coin-content");
    const title = createParagraph("coinP", item.name);
    coinTableTitle.appendChild(title);

    const coinTableImg = createTableRow("coinTableRow", "coin-content");
    const image = document.createElement("img");
    image.src = item.image;
    image.classList.add("coinImg");
    coinTableImg.appendChild(image);

    const coinTableTitle2 = createTableRow("coinTableRow", "coin-content");
    const title2 = createParagraph("coinSymbol", item.symbol);
    coinTableTitle2.appendChild(title2);

    const coinTableButton = createTableRow("coinTableRow", "coin-content");
  const button = document.createElement("button");
  button.classList.add("more-info");
  button.type = "button";
  button.innerText = "More Info";
  button.addEventListener("click", () => moreInfo(event)); // נעבור את המטבע כפרמטר לפונקציה
  coinTableButton.appendChild(button);

    coinCardTable.appendChild(coinTableTitle);
    coinCardTable.appendChild(coinTableImg);
    coinCardTable.appendChild(coinTableTitle2);
    coinCardTable.appendChild(coinTableButton);

    coinCard.appendChild(toggleButton);
    coinCard.appendChild(coinCardTable);

    return coinCard;
  }

  function toggle(item) {
    const coinId = item.id;
    const toggleText = document.getElementById(`toggle-${coinId}`);
    const coinCard = document.getElementById(`coin-${coinId}`);
  
    if (selectedCoins.has(coinId)) {
      selectedCoins.delete(coinId);
      toggleText.innerHTML = "OFF";
      toggleText.classList.remove("active");
      coinCard.classList.remove("selected");
      console.log(selectedCoins);

    } else {
      if (selectedCoins.size < coinsToShow) {
        selectedCoins.add(coinId);
        toggleText.innerHTML = "ON";
        toggleText.classList.add("active");
        coinCard.classList.add("selected");
        console.log(selectedCoins);

      }  else  {
        if (selectedCoins.size >= coinsToShow) {
        alert(`You can't choose more than 5 coins. Delete one coin to add the last coin that you tried to add.`);
        const trigerModalCoin = coinCard;
        openManageModal(trigerModalCoin);
      }}
    }
  
    // updateSelectedCoinsOnPage(); // Update the selected coins on the main page
  }

  function closeModal(trigerModalCoin) {
    modal.style.display = "none";
    
    if (trigerModalCoin) {
      trigerModalCoin.classList = `coin-card selected`;
    }
    trigerModalCoin.classList = `coin-card selected`;
    const selectedCoinId = trigerModalCoin.id.split("-")[1];
    selectedCoins.add(selectedCoinId);
    selectedCoinsArray = Array.from(selectedCoins);
    console.log(selectedCoins);
  }

  function openManageModal(trigerModalCoin) {
    selectedCoinsArray = Array.from(selectedCoins);

    if (selectedCoinsArray.length >= coinsToShow) {
      selectedCoinsContainer.innerHTML = ""; // Clear the container
      selectedCoinsArray.forEach((coinId) => {
        const coin = data.find((item) => item.id === coinId);
        const coinCard = createCoinCard(coin);
        coinCard.classList = "coin-card selected"; // Add class for distinguishing modal coin cards
        selectedCoinsContainer.appendChild(coinCard);
      });

      modal.style.display = "block";
      selectedCoinsContainer.addEventListener("click", function (event) {
        const selectedCoinCard = event.target.closest(".coin-card");
        if (selectedCoinCard) {
          const selectedCoinId = selectedCoinCard.id.split("-")[1];
          console.log(selectedCoinId);

          selectedCoins.delete(selectedCoinId);

          const toggleText = document.getElementById(`toggle-${selectedCoinId}`);
          const coinCard = document.getElementById(`coin-${selectedCoinId}`);
          toggleText.innerHTML = "OFF";
          toggleText.classList.remove("active");
          coinCard.classList.remove("selected");

          const previouslyClickedCoinId = selectedCoinsArray[selectedCoinsArray.length - 1];
          if (previouslyClickedCoinId) {
            const previouslyClickedToggleText = document.getElementById(`toggle-${previouslyClickedCoinId}`);
            const previouslyClickedCoinCard = document.getElementById(`coin-${previouslyClickedCoinId}`);
            previouslyClickedToggleText.innerHTML = "ON";
            previouslyClickedToggleText.classList.add("active");
            previouslyClickedCoinCard.classList.add("selected");
          }

          selectedCoinsArray = Array.from(selectedCoins);
          closeModal(trigerModalCoin);
        }
      });
    }
  }

  async function moreInfo(event) {
    const button = event.target;
    const coinCard = button.closest('.coin-card');
    const info = coinCard.querySelector('.info');
    
    if (info) {
      // If info exists, remove it to clear the content
      coinCard.removeChild(info);
    } else {
      await fetch(`bitcoin.json`)
        .then(response => response.json())
        .then(data => {
          const info = document.createElement('div');
          info.classList.add('info');
        
          if (data.market_data.current_price) {
            const USDPriceP = document.createElement('p');
            USDPriceP.innerHTML = `USD Price: ${data.market_data.current_price.usd}$`;
  
            const EURPriceP = document.createElement('p');
            EURPriceP.innerHTML = `EUR Price: ${data.market_data.current_price.eur}€`;
  
            const ILSPriceP = document.createElement('p');
            ILSPriceP.innerHTML = `ILS Price: ${data.market_data.current_price.ils}₪`;
  
            info.appendChild(USDPriceP);
            info.appendChild(EURPriceP);
            info.appendChild(ILSPriceP);
          } else {
            const errorP = document.createElement('p');
            errorP.innerHTML = 'Price data not available';
            info.appendChild(errorP);
          }
  
          coinCard.appendChild(info);
        });
    }
  }

  function createTableRow(rowClass, cellClass) {
    const row = document.createElement("tr");
    row.classList.add(rowClass);
    const cell = document.createElement("td");
    cell.classList.add(cellClass);
    row.appendChild(cell);
    return row;
  }

  function createParagraph(paragraphClass, content) {
    const paragraph = document.createElement("p");
    paragraph.classList.add(paragraphClass);
    paragraph.innerText = content;
    return paragraph;
  }

  closeModalBtn.addEventListener("click", closeModal);
});