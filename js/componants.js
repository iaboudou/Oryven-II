// create and return the card element

import { fetchMetals } from "./fetch.js";

// calculate the diffence prix percentage between two dates (depend on the range fetched by the query)
export function metalCard(metal) {
  let dp = metal.price - metal.previousPrice;
  let percentage = !metal.previousPrice ? 0 : (dp / metal.previousPrice) * 100;

  let card = document.createElement("div");
  card.className = "card";

  let title = document.createElement("h3");
  title.textContent = metal.name;

  let price = document.createElement("p");
  price.className = "price";
  price.textContent = `${metal.price.toFixed(2)} ${metal.currency}`;

  let unit = document.createElement("p");
  unit.className = "unit";
  unit.textContent = `Prix par ${metal.unit}`;

  let difference = document.createElement("p");
  difference.textContent = `${dp >= 0 ? "▲" : "▼"} ${percentage.toFixed(2)} %`;
  difference.style.color = dp >= 0 ? "green" : "red";

  card.append(title, price, unit, difference);
  return card;
}

// set loading status before fetching
export function startLoadingStatus() {
  let status = document.querySelector("#status");
  let statusText = document.querySelector("#status-text");

  status.classList.remove("success", "error");
  status.classList.add("loading");

  if (statusText) {
    statusText.textContent = "Chargement en cours…";
    let retry = document.querySelector("#retry");
    if (retry) retry.hidden = true;
  } else {
    let circle = document.createElement("span");
    circle.className = "rotatedcircle";

    let text = document.createElement("span");
    text.id = "status-text";
    text.textContent = "Chargement en cours…";

    let retry = document.createElement("button");
    retry.id = "retry";
    retry.type = "button";
    retry.hidden = true;
    retry.textContent = "Réessayer";

    status.replaceChildren(circle, text, retry);
  }
}

// update loading status on the header after fetching and set last time updated
export function endLoadingStatus(metals, fetched) {
  let status = document.querySelector("#status");
  let statusText = document.querySelector("#status-text");

  status.classList.remove("loading");

  if (!fetched) {
    status.classList.remove("success");
    status.classList.add("error");
    let msg;
    switch (metals) {
      case "offline": msg = "Vous êtes hors ligne"; break;
      case "network": msg = "Erreur de réseau"; break;
      case "client": msg = "Erreur côté client"; break;
      case "server": msg = "Erreur côté serveur"; break;
      case "quota": msg = "Quota dépassé"; break;
      case "parse": msg = "Erreur de lecture des données"; break;
      default: msg = "Erreur de chargement des prix";
    }
    if (statusText) {
      statusText.textContent = msg;
    } else {
      status.textContent = msg;
    }
    let retry = document.querySelector("#retry");
    if (retry) retry.hidden = false;
    return;
  }
  status.classList.remove("error");
  status.classList.add("success");

  let date = new Date(metals[0]?.updated_at);
  let dateFormatted = `Dernière mise à jour : ${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()} à ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  if (statusText) {
    statusText.textContent = dateFormatted;
    let retry = document.querySelector("#retry");
    if (retry) retry.hidden = true;
  } else {
    let circle = document.createElement("span");
    circle.className = "rotatedcircle";

    let text = document.createElement("span");
    text.id = "status-text";
    text.textContent = dateFormatted;

    let retry = document.createElement("button");
    retry.id = "retry";
    retry.type = "button";
    retry.hidden = true;
    retry.textContent = "Réessayer";

    status.replaceChildren(circle, text, retry);
  }
}

// create and insert the status header if missing
export function statusHeaderLoading() {
  if (document.querySelector("#status")) return;

  let status = document.createElement("div");
  status.id = "status";
  status.className = "status loading";
  status.innerHTML = `
    <span class="rotatedcircle"></span>
    <span id="status-text">Chargement en cours…</span>
    <button id="retry" type="button" hidden>Réessayer</button>
  `;
  let header = document.querySelector(".topbar");
  if (header) {
    header.after(status);
  } else {
    document.body.prepend(status);
  }
}

// the chart header
export function chartbase() {
  let el = document.createElement("div");
  el.innerHTML = `
  <section class="history">
    <div class="cntrls">
      <select id="history-metal" class="history-metal">
        <option value="xau">Or</option>
        <option value="silver">Argent</option>
      </select>
      <button type="button" class="chartbutton history-7d" data-days="7">7 jours</button>
      <button type="button" class="chartbutton history-30d" data-days="30">30 jours</button>
    </div>

    <div class="container-bar-char">
      <span class="label4"></span>

      <span class="label3"> </span>
      <span class="label2"> </span>
      <span class="label1"> </span>

      <svg id="bar_chart" viewBox="0 0 1500 500">
      </svg>

      <span class="label-days5"></span>
      <span class="label-days6"></span>
      <span class="label-days7"></span>
    </div>
  </section>`;

  return el;
}

// render the line shart
export function renderHistoryChart(points, days, currency) {
  let svg = document.getElementById("bar_chart");
  let w = 1500;
  let h = 500;

  let maxPrice = Math.max(...points.map((p) => Math.round(p.price)));
  let label1 = document.querySelector(".label1");
  let label2 = document.querySelector(".label2");
  let label3 = document.querySelector(".label3");
  let label4 = document.querySelector(".label4")
  let label_days5 = document.querySelector(".label-days5");
  let label_days6 = document.querySelector(".label-days6");
  let label_days7 = document.querySelector(".label-days7");

  
  let fmt = (v) => (v >= 10 ? Math.floor(v) : v.toFixed(1));
  label1.textContent = fmt(maxPrice * 0.25);
  label2.textContent = fmt(maxPrice * 0.5);
  label3.textContent = fmt(maxPrice * 0.75);
  label4.textContent = `prix en ${currency}`

  let d = 30;
  if (days == "30d") {
    label_days5.textContent = 10;
    label_days6.textContent = 20;
    label_days7.textContent = 30;
  } else if (days == "7d") {
    d = 7;
    label_days5.textContent = 2;
    label_days6.textContent = 4;
    label_days7.textContent = 6;
  }

  
  // calculate the exact (x, y) points will be rendred
  let pts = [];
  let shown = points.slice(-d);
  shown.forEach((p, i) => {
    let x = w - (w * i) / Math.max(shown.length - 1, 1);
    let y = h - (p.price * h) / maxPrice;
    pts.push(`${x},${y}`);
  });

  let polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );

  polyline.setAttribute("points", pts.join(" "));
  polyline.setAttribute("stroke-width", 3);
  polyline.setAttribute("stroke", "var(--text)");
  polyline.setAttribute("fill", "none");

  svg.append(polyline);
}


export function estamateHTML() {
  let el = document.createElement("div");
  el.innerHTML = `
  <section class="estimator">
    <h2>Estimateur de bijou</h2>

    <form id="estimate-form">
      <div class="field">
        <label for="weight">Poids (grammes)</label>
        <input id="weight" type="text"/>
        <p id="weight-error" class="field-error"></p>
      </div>
      <div class="field">
        <label for="estimate-metal">Métal</label>
        <select id="estimate-metal">
          <option value="Or">Or</option>
          <option value="Argent">Argent</option>
        </select>
      </div>
      <button type="submit" class="btnEstimate">Estimer</button>
    </form>

    <p id="estimate-result"></p>
  </section>
  `
  return el
}

export async function estimate(currency) {
  let weight = document.querySelector("#weight").value.trim().replace(",", ".");
  let metal = document.querySelector("#estimate-metal").value;
  let err = document.querySelector("#weight-error");
  let result = document.querySelector("#estimate-result");

  if (!/^\d+(\.\d+)?$/.test(weight) || Number(weight) <= 0) {
    err.textContent = "le poids n'est pas valide";
    result.textContent = "";
    return;
  }
  err.textContent = "";

  let metals = await fetchMetals(currency);
  if (typeof metals === "string") {
    err.textContent = "prix indisponible, réessayez plus tard";
    return;
  }
  let m = metals?.find((m) => m.name === metal);
  if (!m) {
    err.textContent = "prix n'est pas valide";
    return;
  }

  let val = Math.round(weight * m.price * 100) / 100;

  result.textContent = `Valeur estimée : ${val} ${m.currency}`;
}

// market price page
export function marketPricePage() {
  let section = document.querySelector(".oryven");
  if (!section) {
    section = document.createElement("section");
    section.className = "oryven";
    let cards = document.createElement("div");
    cards.id = "cards";
    cards.className = "cards";
    let container = document.createElement("div");
    container.className = "container";
    section.append(cards, container);
  }
  return section;
}

// catalogue page
export function cataloguePage() {
  let a = document.createElement("div");

  a.innerHTML = `
<section id="catalogue-page">
  <header class="catalogue-header">
    <button id="add-product">Ajouter un article</button>
  </header>

  <div class="catalogue-controls">
    <input type="search" id="search-product"
      placeholder="Rechercher un article..." />

    <select id="filter-status">
      <option value="all">Tous les statuts</option>
      <option value="available">Disponible</option>
      <option value="reserved">Réservé</option>
    </select>

    <select id="sort-products">
      <option value="title">Trier par titre</option>
      <option value="price">Trier par prix</option>
      <option value="date">Trier par date</option>
    </select>
  </div>

  <div id="products-list"></div>
  <p id="catalogue-status"></p>

  <dialog id="product-modal">
    <form id="product-form">
      <h3 id="form-title">Ajouter un article</h3>
      <input id="product-title" type="text" placeholder="Titre" required />
      <textarea id="product-description" placeholder="Description" required></textarea>
      <input id="product-price" type="number" placeholder="Prix" required />
      <button type="submit">Enregistrer</button>
      <button type="button" id="cancel-product">Annuler</button>
    </form>
  </dialog>

  <dialog id="delete-modal">
    <p>Tu veux vraiment supprimer cet article ?</p>
    <button id="confirm-delete">Confirmer</button>
    <button type="button" id="cancel-delete">Annuler</button>
  </dialog>
</section>
`;

  return a;
}
