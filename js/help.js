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
export function showCataloguePage(main, cataloguePageFn) {
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

  let status = document.querySelector("#status");
  if (status) status.remove();

  let catalogueEl = cataloguePageFn();
  main.append(catalogueEl);
}
