let i = 0;
let bordersData;
let locateBtn = document.querySelector(".primary-btn");

locateBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (success) => {
      let lat = success.coords.latitude;
      let long = success.coords.longitude;
      let accuracy = success.coords.accuracy;

      locateBtn.innerHTML =
        '<i class="fa-solid fa-spinner animate-spin"></i> Locating...';
      geoCodeAPI(lat, long);

      waitForMap(() => {
        mapUI(lat, long, accuracy);
      });
    },
    (err) => console.log(err)
  );

  let map;
  function mapUI(lat, long, accuracy) {
    if (map) {
      map.remove();
    }

    map = L.map("map").setView([lat, long], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, long]).addTo(map).bindPopup("You are here").openPopup();
  }

  function waitForMap(callBack) {
    const observer = new MutationObserver(() => {
      const myDiv = document.querySelector("#map");
      if (myDiv) {
        observer.disconnect();
        callBack();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  async function geoCodeAPI(lat, lon) {
    try {
      let res = await fetch(
        `https://geocode.xyz/${lat},${lon}?geoit=json&auth=435650209409691291029x89364`
      );
      let resJSON = await res.json();
      let { country } = resJSON;
      countryDetails(country);
    } catch (err) {
      console.log(err);
    }
  }

  async function countryDetails(countryName) {
    try {
      let country = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      let countryJSON = await country.json();
      let [countryData] = countryJSON;

      // CALL FUNCTIONS
      countryUI(countryData, "results");
      allNeighborsNameUI(countryData, "currentNeighbor");
      neighboringCountriesUI(countryData);
    } catch (err) {
      console.log(err);
    }

    locateBtn.innerHTML = 'Find My Location';
  }

  function countryUI(countryData, elem) {
    document.querySelector('#headPara').innerText = document.querySelector('.hero-text > h1').innerText;
    document.querySelector('.navbar')
    document.querySelector('.hero').innerHTML = null;
    document.querySelector('.hero').style.margin = '0px'
    document.querySelector('.results').style.marginTop = '0px'
    document.querySelector('.results').style.paddingTop = '0px'
    // DESTRUCTURIZATION
    let {
      name,
      capital,
      car,
      coatOfArms,
      continents,
      currencies,
      flags,
      independent,
      languages,
      latlng,
      population,
      subregion,
      timezones,
      unMember,
    } = countryData;

    function cardData(icon, title, value) {
      return `
    <div class="card">
      <h4><i class="fa-solid ${icon}"></i> ${title}</h4>
      <p>${value}</p>
    </div>
  `;
    }

    document.querySelector(`.${elem}`).innerHTML = `
      <div class="flag_coat">
        <div class="flag">
          <img src="${flags.png}" alt="Country Flag" />
          <div class="name">
            <h1>Karachi, ${name.common}</h1>
            <p>${name.official}</p>
          </div>
        </div>
        <div class="card coatArms">
          <h3>Coat of Arms</h3>
          <img
            style="height: 80%;"
            src="${coatOfArms.png}"
            alt="Coat of Arms"
          />
        </div>
      </div>

      <div id="map"></div>

      <div class="cards_neighbor">
        <div class="cards-grid">
            ${cardData("fa-building-columns", "Capital", capital[0])}
            ${cardData("fa-users", "Population", population.toLocaleString())}
            ${cardData("fa-coins", "Currency", currencies.PKR.name)}
            ${cardData("fa-earth-asia", "Continent", continents[0])}
            ${cardData("fa-globe", "Longitude", latlng[1] + "°")}
            ${cardData("fa-globe", "Latitude", latlng[0] + "°")}
            ${cardData(
              "fa-language",
              "Languages",
              `${languages.eng}, ${languages.urd}`
            )}
            ${cardData("fa-car-side", "Driving Side", car.side)}
            ${cardData("fa-clock", "Time Zone", timezones[0])}
            ${cardData("fa-flag", "Independent", independent ? "Yes" : "No")}
            ${cardData("fa-moon", "Sub-Region", subregion)}
            ${cardData(
              "fa-earth-america",
              "UN Member",
              unMember ? "Yes" : "No"
            )}
          </div>

        <div class="borders card">
          <h4><i class="fa-solid fa-road-barrier"></i> Borders</h4>
            <div class="allNeighbor currentNeighbor">
            
            </div>
        </div>
      </div>`;
  }

  async function allNeighborsNameUI(countryData, elem) {
    let { borders } = countryData;

    function neighborCardUI(datas) {
      let neighborsHTML = datas.map((data) => {
        if (!data) {
          return `<div class="neighbor">
                  <img
                  src="${assets / unknown_flag.png}"
                  alt=""
                  />
                  <p>${`unknown country`}</p>
                  </div>`;
        }
        return `<div class="neighbor">
                <img
                src="${data.flags.png}"
                alt=""
                />
                <p>${data.name.common}</p>
                </div>`;
      });
      document.querySelector(`.${elem}`).innerHTML += neighborsHTML.join(" ");
    }

    let neighborCountryPromises = borders.map(async (border) => {
      try {
        let res = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
        let resJSON = await res.json();
        let [data] = resJSON;

        return data;
      } catch (err) {
        console.log(err);
      }
    });

    let neighborsDetails = await Promise.all(neighborCountryPromises);
    neighborCardUI(neighborsDetails);
  }

  async function neighboringCountriesUI(countryDetails) {
    let { borders } = countryDetails;

    let promises = borders.map(async (border) => {
      try {
        let res = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
        let resJSON = await res.json();

        let [borderData] = resJSON;
        return borderData;
      } catch (err) {
        console.log(err);
      }
    });

    bordersData = await Promise.all(promises);
    renderNeighborUI(bordersData[i]);
    allNeighborsNameUI(bordersData[i], `neighborOfNeighbors`);
  }

  window.leftArrowHandler = function () {
    if (!bordersData || bordersData.length === 0) return;
    i === 0 ? (i = bordersData.length - 1) : i--;
    renderNeighborUI(bordersData[i]);
    allNeighborsNameUI(bordersData[i], `neighborOfNeighbors`);
  };

  window.rightArrowHandler = function () {
    if (!bordersData || bordersData.length === 0) return;
    i === bordersData.length - 1 ? (i = 0) : i++;
    renderNeighborUI(bordersData[i]);
    allNeighborsNameUI(bordersData[i], `neighborOfNeighbors`);
  };

  function renderNeighborUI(data) {
    document.querySelector(
      ".resultsneighbor"
    ).innerHTML = `<div class="carousalSlider">
        <h3 id="neighborHeading">Neighbor Countries</h3>
        <div class="flag_coat">
          <div class="flag">
            <img src="${data.flags.png}" alt="Country Flag" />
            <div class="name">
              <h1>${data.name.common}</h1>
              <p>${data.name.official}</p>
              <p>${data.subregion}</p>
            </div>  
          </div>
          <div class="card neighborCard coatArms">
            <h4>Coat of Arms</h4>
            <img src="${data.coatOfArms.png}" alt="Coat of Arms" />
          </div>
        </div>


        <div class="cards_neighbor">
          <div class="cards-grid">
            <div class="card neighborCard">
              <h4><i class="fa-solid fa-building-columns"></i> Capital</h4>
              <p>${data.capital[0]}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-users"></i> Population</h4>
              <p>${data.population}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-earth-asia"></i> Continent</h4>
              <p>${data.continents[0]}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-car-side"></i> Driving Side</h4>
              <p>${data.car.side}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-clock"></i> Time Zone</h4>
              <p>${data.timezones[0]}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-flag"></i> Independent</h4>
              <p>${data.independent == true ? "Yes" : "No"}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-moon"></i> Sub-Region</h4>
              <p>${data.subregion}</p>
            </div>

            <div class="card neighborCard">
              <h4><i class="fa-solid fa-earth-america"></i> Un-Member</h4>
              <p>${data.unMember == true ? "Yes" : "No"}</p>
            </div>
          </div>

          <div class="borders card neighborCard">
            <h4><i class="fa-solid fa-road-barrier"></i> Borders</h4>
            <div class="allNeighbor neighborOfNeighbors">
              
            </div>
          </div>
        </div>
      </div>
      <i onclick="leftArrowHandler()" class="fa-solid fa-circle-chevron-left"></i>
      <i onclick="rightArrowHandler()" class="fa-solid fa-circle-chevron-right"></i>`;
  }
});
