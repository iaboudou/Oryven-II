import { fetchHistory, fetchMetals, request } from "./fetch.js";
import { startLoadingStatus, endLoadingStatus, metalCard, chartbase, renderHistoryChart, estamateHTML, estimate, cataloguePage, marketPricePage, statusHeaderLoading, renderCatalogueItems } from "./componants.js";
import { showCataloguePage, showMarketPricePage, getCatalogueItems } from "./help.js";
let main = document.querySelector("main");
let currency = document.querySelector("#currency");
let refresh = document.querySelector("#refresh");

// after reload, check localstorage, and render "cours des mêteau" or catalogue page
(async () => {
  let page = localStorage.getItem("oryven-page");
  if (page === "catalogue") {
    showCataloguePage(main, cataloguePage, startLoadingStatus);
    let catalogueData = await getCatalogueItems(request)
    renderCatalogueItems(catalogueData)
    console.log(catalogueData)
    return;
  }
  await fetchedAndRendered();
})();

// rerender everything when click 'actualiser'
refresh.addEventListener("click", async () => {
  localStorage.setItem("oryven-page", "pricepage");
  showMarketPricePage(main, marketPricePage, statusHeaderLoading);
  await fetchedAndRendered();
});

// rerender everything when the currency changed
currency.addEventListener("change", async () => {
  localStorage.setItem("oryven-page", "pricepage");
  await fetchedAndRendered();
});

// try to fetch  again when click button retry 
document.addEventListener("click", async (e) => {
  if (!e.target.matches("#retry")) return;
  localStorage.setItem("oryven-page", "pricepage");
  await fetchedAndRendered();
});

// clicking "catalogue"  button should replace to Catalogue page
document.querySelector("#catalogue").addEventListener("click", async(e)=> {
  e.preventDefault();
  localStorage.setItem("oryven-page", "catalogue");
  showCataloguePage(main, cataloguePage, startLoadingStatus);
  let catalogueData = await getCatalogueItems(request)
  renderCatalogueItems(catalogueData)
})

//
function triggerHistoryListeners() {
  let historyMetal = document.querySelector(".history-metal");
  let history7d = document.querySelector(".history-7d");
  let history30d = document.querySelector(".history-30d");
  // when a change happen should fetch again and render the received data
  historyMetal?.addEventListener("change", async (e) => {
    let metal = e?.target?.value;
    let days = document.querySelector(".label-days5")?.textContent === "2" ? "7" : "30";
    let chart = document.getElementById("bar_chart");
  
    let history = await fetchHistory(metal, days);
    if (typeof history === "string") {
      endLoadingStatus(history, false);
      return;
    }
    chart.innerHTML = "";
    renderHistoryChart(history, `${days}d`, currency.value);
  });
  
  // when a click happen to bring 30 days history should fetch again and render the received data
  // this is for "cours des mêteau" page
  history30d?.addEventListener("click", async (e) => {
    e.preventDefault();
  
    let chart = document.getElementById("bar_chart");
    let metal = document.querySelector(".history-metal")?.value;
  
    let history = await fetchHistory(metal, "30");
    if (typeof history === "string") {
      endLoadingStatus(history, false);
      return;
    }
    chart.innerHTML = "";
    renderHistoryChart(history, "30d", currency.value);
  });
  
  // when a click happen to bring 7 days history should fetch again and render the received data
  history7d?.addEventListener("click", async (e) => {
    e.preventDefault();
    let metal = document.querySelector(".history-metal")?.value
    let history = await fetchHistory(metal, "7");
    let chart = document.getElementById("bar_chart");
    if (typeof history === "string") {
      endLoadingStatus(history, false);
      return;
    }
    chart.innerHTML = "";
    renderHistoryChart(history, "7d", currency.value);
  });
}


let triggerEstimateListener = () => {
  document.querySelector("#estimate-form").addEventListener("submit", (e) => {
    e.preventDefault();
    estimate(currency);
  });
}

// fetch and render metals exist in "cours des mêteau" page
async function fetchedAndRendered() {
  let cards = document.querySelector("#cards");
  let container = document.querySelector(".container");
  refresh.disabled = true;
  currency.disabled = true;
  startLoadingStatus();
  cards.innerHTML = "";
  container.innerHTML = "";
  let fetchedmetals = await fetchMetals(currency);
  if (typeof fetchedmetals === "string") {
    endLoadingStatus(fetchedmetals, false);
    refresh.disabled = false;
    currency.disabled = false;
    return false;
  } else {
    // "cours des mêteau" page
    endLoadingStatus(fetchedmetals, true);
    // history in "cours des mêteau" page
    container.append(chartbase());
    triggerHistoryListeners();
    let fetchedhistoory = await fetchHistory("xau", "1mo");
    if (typeof fetchedhistoory === "string") {
      endLoadingStatus(fetchedhistoory, false);
    } else {
      renderHistoryChart(fetchedhistoory, "30d", currency.value);
    }
    // estimation in "cours des mêteau" page
    container.append(estamateHTML())
    triggerEstimateListener()
  }
  fetchedmetals.forEach((metal) => cards.append(metalCard(metal)));
  refresh.disabled = false;
  currency.disabled = false;
  return true;
}
