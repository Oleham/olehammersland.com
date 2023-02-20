(() => {
  // <stdin>
  var slot = document.getElementById("bysykkel-component");
  var inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.setAttribute("style", "margin-bottom:10px;font-family:inherit; font-size:inherit;");
  slot.appendChild(inputField);
  var bikeForm = document.createElement("form");
  bikeForm.setAttribute("id", "bike_form");
  slot.appendChild(bikeForm);
  var bikeDropdown = document.createElement("select");
  bikeDropdown.setAttribute("id", "bike_dropdown");
  bikeDropdown.setAttribute("style", "font-family:inherit; font-size:inherit;");
  bikeForm.appendChild(bikeDropdown);
  var bikeText = document.createElement("div");
  bikeText.setAttribute("id", "bike_text");
  bikeForm.appendChild(bikeText);
  var sortedStationNames = [];
  async function fetchStationsAndAvailability() {
    let response = await fetch("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json", {
      method: "GET",
      headers: { "Client-Identifier": "olehammersland.com" }
    });
    let response2 = await fetch("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", {
      method: "GET",
      headers: { "Client-Identifier": "olehammersland.com" }
    });
    if (response.status === 200 && response2.status === 200) {
      let stinfo = await response.json();
      let sttilgjeng = await response2.json();
      for (let i = 0; i < stinfo.data.stations.length; i++) {
        let st_id = stinfo.data.stations[i].station_id;
        for (let y = 0; y < sttilgjeng.data.stations.length; y++) {
          if (sttilgjeng.data.stations[y].station_id == st_id) {
            stinfo.data.stations[i].num_bikes_available = sttilgjeng.data.stations[y].num_bikes_available;
            stinfo.data.stations[i].num_docks_available = sttilgjeng.data.stations[y].num_docks_available;
            stinfo.data.stations[i].last_reported = sttilgjeng.data.stations[y].last_reported;
            break;
          }
        }
      }
      return await stinfo.data.stations;
    }
  }
  async function renderBikes() {
    let bicycles = await fetchStationsAndAvailability();
    bicycles.forEach((cyc) => {
      sortedStationNames.push(cyc.name);
    });
    sortedStationNames = sortedStationNames.sort();
    populateDropDown(sortedStationNames);
    bikeDropdown.addEventListener("change", function(e) {
      bicycles.forEach(function(cyc) {
        if (e.target.value == cyc.name) {
          date = niceDate(new Date(cyc.last_reported * 1e3));
          bikeText.innerHTML = `<p>${cyc.name} har ${cyc.num_bikes_available == 1 ? cyc.num_bikes_available + " ledig sykkel" : cyc.num_bikes_available + " ledige sykler"} og ${cyc.num_docks_available == 1 ? cyc.num_docks_available + " ledig plass" : cyc.num_docks_available + " ledige plasser"}<br>
                (sist kontrollert ${date}).</p>`;
          return;
        }
      });
    }, false);
  }
  function populateDropDown(stations) {
    while (bikeDropdown.lastChild) {
      bikeDropdown.removeChild(bikeDropdown.lastChild);
    }
    stations.forEach((n) => {
      let textNode = document.createTextNode(n);
      let option = document.createElement("option");
      option.setAttribute("value", n);
      option.appendChild(textNode);
      bikeDropdown.appendChild(option);
    });
  }
  inputField.addEventListener("input", function(e) {
    let searchedStations = sortedStationNames.filter((item) => item.toLowerCase().startsWith(e.target.value.toLowerCase()));
    populateDropDown(searchedStations);
    bikeDropdown.dispatchEvent(new Event("change"));
  });
  function niceDate(date2) {
    let months = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
    let wdays = ["s\xF8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\xF8rdag"];
    let wday = date2.getDay();
    let day = date2.getDate();
    let month = date2.getMonth();
    let hour = date2.getHours();
    let minute = date2.getMinutes();
    if (hour <= 9) {
      hour = "0" + hour;
    }
    if (minute <= 9) {
      minute = "0" + minute;
    }
    return `kl. ${hour}.${minute} ${wdays[wday]} den ${day}. ${months[month]}`;
  }
  renderBikes();
})();
