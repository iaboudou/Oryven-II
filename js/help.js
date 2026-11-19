// this is the main page that show the maket gold and silver price
export function showMarketPricePage(main, marketPricePageFn, statusHeaderLoadingFn) {
  let catalogue = document.querySelector("#catalogue-page");
  if (catalogue) {
    catalogue.remove();
  }
  let market = marketPricePageFn();
  main.append(market);

  let currency = document.querySelector("#currency");
  if (currency) currency.hidden = false;
  let currencyLabel = document.querySelector('.currencylabel');
  if (currencyLabel) currencyLabel.hidden = false;

  statusHeaderLoadingFn();

  return market;
}

// the main page that show the catalogue page 
export function showCataloguePage(main, cataloguePageFn, startLoadingStatus) {
  let e = document.querySelector("#catalogue-page");
  if (e) e.remove();

  let marcketpage = document.querySelector(".oryven");
  if (marcketpage) {
    marcketpage.remove();
  }

  let currency = document.querySelector("#currency");
  if (currency) currency.hidden = true;
  let currencyLabel = document.querySelector('.currencylabel');
  if (currencyLabel) currencyLabel.hidden = true;

  startLoadingStatus();

  let catalogueEl = cataloguePageFn();
  main.append(catalogueEl);

  let status = document.querySelector("#status");
  let statusText = document.querySelector("#status-text");
  if (status) {
    status.classList.remove("loading", "error");
    status.classList.add("success");
  }
  if (statusText) {
    statusText.textContent = "Votre Catalogue";
    let retry = document.querySelector("#retry");
    if (retry) retry.hidden = true;
  }
}
// it fetch the data exist in db.json with GET method, and it return data or error type
export async function getCatalogueItems(request) {
  let response = await request("/items", { method: "GET" });
  if (response.is_resolved) {
    return response.resultat;
  }
  return response;
}
