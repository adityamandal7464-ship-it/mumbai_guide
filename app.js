const map = L.map("map", {
    minZoom: 10,
    maxZoom: 18,
    maxBounds: [
        [18.75, 72.70],
        [19.35, 73.10]
    ],
    maxBoundsViscosity: 0.8
}).setView([19.0760, 72.8777], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

const content = document.getElementById("content");
const detailsBox = document.getElementById("details");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const monthFilter = document.getElementById("monthFilter");
const locationButton = document.getElementById("locationButton");
const statusBox = document.getElementById("statusBox");
const filtersBox = document.getElementById("filters");
const languageSelect = document.getElementById("languageSelect");
const photoModal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const closePhoto = document.getElementById("closePhoto");

let activeTab = "places";
let currentLocation = null;
let currentMarker = null;
let routeLine = null;
let language = "hinglish";

const categoryColors = {
    historic: "#8e44ad",
    tourist: "#e67e22",
    beach: "#2980b9",
    religious: "#c0392b",
    nature: "#27ae60",
    museum: "#16a085",
    viewpoint: "#34495e",
    market: "#d35400"
};

const translations = {
    hinglish: {
        title: "📍 Mumbai Explorer",
        subtitle: "Mumbai travel, festivals, food aur hotel guide",
        search: "Mumbai me place search karein",
        location: "📍 Meri Current Location Dhoondein",
        places: "Places",
        festivals: "Festivals",
        food: "Food",
        hotels: "Hotels",
        guide: "Guide"
    },
    hindi: {
        title: "📍 मुंबई एक्सप्लोरर",
        subtitle: "मुंबई यात्रा, त्योहार, भोजन और होटल गाइड",
        search: "मुंबई में स्थान खोजें",
        location: "📍 मेरी वर्तमान लोकेशन खोजें",
        places: "स्थान",
        festivals: "त्योहार",
        food: "भोजन",
        hotels: "होटल",
        guide: "गाइड"
    },
    marathi: {
        title: "📍 मुंबई एक्सप्लोरर",
        subtitle: "मुंबई प्रवास, सण, खाद्यपदार्थ आणि हॉटेल मार्गदर्शक",
        search: "मुंबईतील ठिकाणे शोधा",
        location: "📍 माझे सध्याचे स्थान शोधा",
        places: "ठिकाणे",
        festivals: "सण",
        food: "खाद्यपदार्थ",
        hotels: "हॉटेल्स",
        guide: "मार्गदर्शक"
    },
    english: {
        title: "📍 Mumbai Explorer",
        subtitle: "Mumbai travel, festivals, food and hotel guide",
        search: "Search Mumbai places",
        location: "📍 Find My Current Location",
        places: "Places",
        festivals: "Festivals",
        food: "Food",
        hotels: "Hotels",
        guide: "Guide"
    }
};

function setStatus(message) {
    statusBox.style.display = "block";
    statusBox.innerHTML = message;
}

function hideGlobalDetails() {
    detailsBox.classList.remove("active");
    detailsBox.innerHTML = "";
}

function closeAllInlineDetails() {
    document.querySelectorAll(".inline-details").forEach(element => {
        element.classList.remove("open");
        element.innerHTML = "";
    });

    document.querySelectorAll(".active-card").forEach(element => {
        element.classList.remove("active-card");
    });
}

function safeImage(url, altText) {
    if (!url || typeof url !== "string") {
        return "";
    }

    return `
    <img
      class="safe-image"
      src="${url}"
      alt="${altText || "Mumbai image"}"
      loading="lazy"
      onerror="this.classList.add('image-error')"
      onclick="openPhoto(event, '${url}')"
    >
  `;
}

function formatMonths(months) {
    const names = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return months.map(month => names[month]).join(", ");
}

function createPlaceIcon(place) {
    const color = categoryColors[place.cat] || "#087f8c";

    return L.divIcon({
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        html: `
      <div style="
        width:30px;
        height:30px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${color};
        border:3px solid white;
        box-shadow:0 2px 7px rgba(0,0,0,.45);
      ">
        <div style="
          transform:rotate(45deg);
          text-align:center;
          color:white;
          line-height:24px;
          font-size:14px;
        ">📍</div>
      </div>
    `
    });
}

function createFestivalIcon() {
    return L.divIcon({
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        html: `
      <div style="
        width:32px;
        height:32px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:#f39c12;
        border:3px solid white;
        box-shadow:0 2px 7px rgba(0,0,0,.5);
      ">
        <div style="
          transform:rotate(45deg);
          text-align:center;
          color:white;
          line-height:26px;
          font-size:15px;
        ">🎉</div>
      </div>
    `
    });
}

function getFilteredPlaces() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const month = monthFilter.value;

    return places.filter(place => {
        const searchableText = `
      ${place.name}
      ${place.address}
      ${place.desc}
      ${place.food}
    `.toLowerCase();

        return (
            searchableText.includes(search) &&
            (category === "all" || place.cat === category) &&
            (month === "all" || place.months.includes(Number(month)))
        );
    });
}

function getPlaceDetailsHTML(place) {
    return `
    <div class="inline-details open">
      <h4>${place.name}</h4>

      <p><strong>Category:</strong> ${place.cat}</p>
      <p><strong>Address:</strong> ${place.address}</p>
      <p><strong>History:</strong> ${place.history}</p>
      <p>${place.desc}</p>
      <p><strong>Best time:</strong> ${place.time}</p>
      <p><strong>Best months:</strong> ${formatMonths(place.months)}</p>
      <p><strong>Entry:</strong> ${place.fee}</p>
      <p><strong>Estimated budget:</strong> ${place.budget}</p>
      <p><strong>Nearby food:</strong> ${place.food}</p>
      <p><strong>Tourist tip:</strong> ${place.tip}</p>

      ${safeImage(place.img, place.name)}

      <button class="close-place-details">
        Details band karein
      </button>
    </div>
  `;
}

function openPlaceDetails(place, card) {
    closeAllInlineDetails();
    hideGlobalDetails();

    const box = card.querySelector(".place-details-container");

    box.innerHTML = getPlaceDetailsHTML(place);
    box.classList.add("open");
    card.classList.add("active-card");

    box.querySelector(".close-place-details").addEventListener("click", () => {
        box.classList.remove("open");
        box.innerHTML = "";
        card.classList.remove("active-card");
    });

    map.setView([place.lat, place.lng], 15);

    setTimeout(() => {
        box.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }, 100);
}

function renderPlaces() {
    markerLayer.clearLayers();
    content.innerHTML = "";
    hideGlobalDetails();

    const list = getFilteredPlaces();

    list.forEach(place => {
        const marker = L.marker(
            [place.lat, place.lng], { icon: createPlaceIcon(place) }
        ).addTo(markerLayer);

        marker.bindTooltip(place.name);

        marker.on("click", () => {
            map.setView([place.lat, place.lng], 15);
        });

        const card = document.createElement("article");
        card.className = "card place-card";
        card.dataset.id = place.id;

        card.innerHTML = `
      <span class="badge">${place.cat}</span>
      <h3>${place.name}</h3>
      <p><strong>Location:</strong> ${place.address}</p>
      <p>${place.desc}</p>
      <p><strong>Budget:</strong> ${place.budget}</p>

      <div class="actions">
        <button class="small-button details-button">
          Details
        </button>

        <button class="small-button route-button">
          Route
        </button>
      </div>

      <div class="place-details-container"></div>
    `;

        card.querySelector(".details-button").addEventListener("click", () => {
            openPlaceDetails(place, card);
        });

        card.querySelector(".route-button").addEventListener("click", () => {
            calculateRoute(place.id);
        });

        content.appendChild(card);
    });

    if (!list.length) {
        content.innerHTML = `
      <div class="empty">Koi place nahi mila.</div>
    `;
    }
}

function createFestivalMarker(festival, venue) {
    const marker = L.marker(
        [venue[2], venue[3]], { icon: createFestivalIcon() }
    ).addTo(markerLayer);

    marker.bindPopup(`
    <strong>🎉 ${festival.name}</strong><br>
    <b>${venue[0]}</b><br>
    📍 ${venue[1]}<br>
    🚆 ${venue[4]}
  `);

    marker.on("click", () => {
        map.setView([venue[2], venue[3]], 16);
    });
}

function festivalDetailsHTML(festival) {
    const venues = festival.venues.map((venue, index) => `
    <div class="venue-box">
      <h5>📍 ${index + 1}. ${venue[0]}</h5>

      <p><strong>Exact location:</strong> ${venue[1]}</p>
      <p><strong>Nearest station:</strong> ${venue[4]}</p>
      <p><strong>How to reach:</strong> ${venue[5]}</p>
      <p><strong>What to see:</strong> ${venue[6]}</p>
      <p><strong>Budget:</strong> ${venue[7]}</p>

      <button
        class="venue-button"
        data-lat="${venue[2]}"
        data-lng="${venue[3]}"
        data-name="${venue[0]}"
      >
        🗺️ Map par location dekhein
      </button>
    </div>
  `).join("");

    const photos = Array.isArray(festival.photos) ?
        festival.photos.map(photo =>
            safeImage(photo, festival.name)
        ).join("") :
        "";

    return `
    <div class="inline-details open">
      <h4>🎉 ${festival.name}</h4>

      <p><strong>Month:</strong> ${festival.month}</p>
      <p><strong>History:</strong> ${festival.history}</p>
      <p>${festival.desc}</p>

      <div class="tip">
        <strong>Tourist tip:</strong><br>
        ${festival.tip}
      </div>

      ${
        photos
          ? `
            <h5>📸 Photos</h5>
            <div class="gallery">${photos}</div>
          `
          : ""
      }

      <h5>📍 Exact famous locations</h5>
      <p>Total locations: <strong>${festival.venues.length}</strong></p>

      ${venues}
    </div>
  `;
}

function openFestivalDetails(festival, card) {
  closeAllInlineDetails();
  hideGlobalDetails();

  const box = card.querySelector(".festival-details-container");

  box.innerHTML = festivalDetailsHTML(festival);
  box.classList.add("open");
  card.classList.add("active-card");

  festival.venues.forEach(venue => {
    createFestivalMarker(festival, venue);
  });

  map.fitBounds(
    festival.venues.map(venue => [venue[2], venue[3]]),
    { padding: [35, 35] }
  );

  box.querySelectorAll(".venue-button").forEach(button => {
    button.addEventListener("click", () => {
      focusVenue(
        Number(button.dataset.lat),
        Number(button.dataset.lng),
        button.dataset.name
      );
    });
  });

  setTimeout(() => {
    box.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 100);
}

function renderFestivals() {
  markerLayer.clearLayers();
  content.innerHTML = "";
  hideGlobalDetails();

  festivals.forEach(festival => {
    const card = document.createElement("article");
    card.className = "card festival-card";

    card.innerHTML = `
      <span class="badge">${festival.month}</span>
      <h3>🎉 ${festival.name}</h3>
      <span class="count">
        ${festival.venues.length} exact locations
      </span>
      <p>${festival.desc}</p>

      <div class="actions">
        <button class="small-button festival-button">
          📍 Details aur locations
        </button>
      </div>

      <div class="festival-details-container"></div>
    `;

    card.querySelector(".festival-button")
      .addEventListener("click", () => {
        openFestivalDetails(festival, card);
      });

    content.appendChild(card);
  });
}

function focusVenue(lat, lng, name) {
  map.setView([lat, lng], 16);

  L.popup()
    .setLatLng([lat, lng])
    .setContent(`<strong>📍 ${name}</strong>`)
    .openOn(map);
}

function renderFood() {
  markerLayer.clearLayers();
  content.innerHTML = "";
  hideGlobalDetails();

  foodPlaces.forEach(item => {
    const [
      name,
      address,
      lat,
      lng,
      food,
      budget,
      nearest
    ] = item;

    const marker = L.marker([lat, lng])
      .addTo(markerLayer)
      .bindPopup(`
        <strong>🍽️ ${name}</strong><br>
        ${address}
      `);

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">Food Area</span>
      <h3>${name}</h3>
      <p><strong>Location:</strong> ${address}</p>
      <p><strong>Popular food:</strong> ${food}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Nearest:</strong> ${nearest}</p>

      <button class="small-button food-map-button">
        📍 Map par dekhein
      </button>
    `;

    card.querySelector(".food-map-button")
      .addEventListener("click", () => {
        map.setView([lat, lng], 15);
        marker.openPopup();
      });

    content.appendChild(card);
  });
}

function renderHotels() {
  markerLayer.clearLayers();
  content.innerHTML = "";
  hideGlobalDetails();

  content.innerHTML = `
    <h2 class="section-title">🏨 Mumbai Hotel Areas</h2>
    <div class="tip">
      Hotel prices estimated hain. Weekend, festival aur season ke according rates change ho sakte hain.
    </div>
  `;

  hotels.forEach(item => {
    const [
      name,
      address,
      lat,
      lng,
      budget,
      bestFor,
      transport
    ] = item;

    const marker = L.marker([lat, lng])
      .addTo(markerLayer)
      .bindPopup(`
        <strong>🏨 ${name}</strong><br>
        ${address}<br>
        ${budget}
      `);

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">Hotel Area</span>
      <h3>${name}</h3>
      <p><strong>Location:</strong> ${address}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Best for:</strong> ${bestFor}</p>
      <p><strong>Transport:</strong> ${transport}</p>

      <button class="small-button hotel-map-button">
        📍 Map par dekhein
      </button>
    `;

    card.querySelector(".hotel-map-button")
      .addEventListener("click", () => {
        map.setView([lat, lng], 15);
        marker.openPopup();
      });

    content.appendChild(card);
  });
}

function renderGuide() {
  markerLayer.clearLayers();
  content.innerHTML = "";
  hideGlobalDetails();

  content.innerHTML = `
    <h2 class="section-title">🧭 Mumbai Travel Guide</h2>

    <article class="card">
      <h3>📅 Best time to visit</h3>
      <p><strong>October-February:</strong> Sightseeing ke liye best weather.</p>
      <p><strong>March-May:</strong> Garmi hoti hai; beaches evening me visit karein.</p>
      <p><strong>June-September:</strong> Monsoon aur greenery beautiful hoti hai.</p>
    </article>

    <article class="card">
      <h3>🗺️ One-day plan</h3>
      <p><strong>Morning:</strong> Gateway of India, Colaba aur CSMT.</p>
      <p><strong>Afternoon:</strong> Kala Ghoda Museum aur Fort.</p>
      <p><strong>Evening:</strong> Marine Drive aur Girgaum Chowpatty.</p>
    </article>

    <article class="card">
      <h3>🚆 Transport</h3>
      <p>Local train, Metro, BEST bus, taxi, auto aur app cabs available hain.</p>
    </article>

    <article class="card">
      <h3>⚠️ Safety</h3>
      <p>Crowded areas me phone, wallet aur bag ka dhyan rakhein.</p>
      <p>Monsoon me sea warning areas se door rahein.</p>
      <p>Religious places ke rules follow karein.</p>
    </article>
  `;
}

function changeTab(tabName) {
  activeTab = tabName;

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.tab === tabName
    );
  });

  filtersBox.style.display =
    tabName === "places" ? "flex" : "none";

  closeAllInlineDetails();
  hideGlobalDetails();

  if (tabName === "places") renderPlaces();
  if (tabName === "festivals") renderFestivals();
  if (tabName === "food") renderFood();
  if (tabName === "hotels") renderHotels();
  if (tabName === "guide") renderGuide();
}

function updateLanguage() {
  language = languageSelect.value;

  const current = translations[language];

  document.getElementById("appTitle").textContent = current.title;
  document.getElementById("appSubtitle").textContent = current.subtitle;
  searchInput.placeholder = current.search;
  locationButton.textContent = current.location;

  document.querySelector('[data-tab="places"]').textContent = current.places;
  document.querySelector('[data-tab="festivals"]').textContent = current.festivals;
  document.querySelector('[data-tab="food"]').textContent = current.food;
  document.querySelector('[data-tab="hotels"]').textContent = current.hotels;
  document.querySelector('[data-tab="guide"]').textContent = current.guide;

  changeTab(activeTab);
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus("Aapka browser GPS support nahi karta.");
    return;
  }

  setStatus("Aapki current location find ki ja rahi hai...");

  navigator.geolocation.getCurrentPosition(
    position => {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      currentMarker = L.marker([
        currentLocation.lat,
        currentLocation.lng
      ])
        .addTo(map)
        .bindPopup("📍 Aapki current location")
        .openPopup();

      map.setView([
        currentLocation.lat,
        currentLocation.lng
      ], 14);

      setStatus("Aapki current location map par show ho rahi hai.");
    },
    () => {
      setStatus(
        "Location permission nahi mili. Browser settings me location allow karein."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

async function calculateRoute(placeId) {
  const place = places.find(item => item.id === placeId);

  if (!place) return;

  if (!currentLocation) {
    setStatus(
      "Route ke liye pehle current location button press karein."
    );
    return;
  }

  try {
    setStatus("Route calculate ho raha hai...");

    const start =
      `${currentLocation.lng},${currentLocation.lat}`;

    const end =
      `${place.lng},${place.lat}`;

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start};${end}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const result = await response.json();

    if (!result.routes || !result.routes.length) {
      setStatus("Is place ke liye route nahi mila.");
      return;
    }

    const route = result.routes[0];

    if (routeLine) {
      map.removeLayer(routeLine);
    }

    routeLine = L.geoJSON(route.geometry, {
      style: {
        color: "#e74c3c",
        weight: 6,
        opacity: 0.9
      }
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), {
      padding: [30, 30]
    });

    const distance =
      (route.distance / 1000).toFixed(1);

    const minutes =
      Math.round(route.duration / 60);

    setStatus(
      `<strong>${place.name}</strong><br>` +
      `Distance: ${distance} km<br>` +
      `Estimated time: ${minutes} minutes`
    );
  } catch (error) {
    setStatus(
      "Route service unavailable hai. Internet connection check karein."
    );
  }
}

function openPhoto(event, url) {
  event.stopPropagation();

  modalImage.src = url;
  photoModal.style.display = "flex";
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    changeTab(tab.dataset.tab);
  });
});

searchInput.addEventListener("input", () => {
  if (activeTab === "places") {
    renderPlaces();
  }
});

categoryFilter.addEventListener("change", () => {
  if (activeTab === "places") {
    renderPlaces();
  }
});

monthFilter.addEventListener("change", () => {
  if (activeTab === "places") {
    renderPlaces();
  }
});

languageSelect.addEventListener("change", updateLanguage);
locationButton.addEventListener("click", getCurrentLocation);

closePhoto.addEventListener("click", () => {
  photoModal.style.display = "none";
});

photoModal.addEventListener("click", event => {
  if (event.target === photoModal) {
    photoModal.style.display = "none";
  }
});

const legend = L.control({
  position: "bottomleft"
});

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");

  div.innerHTML = `
    <strong>Map categories</strong><br>
    <span style="background:#8e44ad"></span> Historical<br>
    <span style="background:#2980b9"></span> Beach<br>
    <span style="background:#27ae60"></span> Nature<br>
    <span style="background:#c0392b"></span> Religious<br>
    <span style="background:#f39c12"></span> Festival
  `;

  return div;
};

legend.addTo(map);
renderPlaces();