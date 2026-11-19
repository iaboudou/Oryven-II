//
export function validateFormToAddToCatalogue(form) {
  return form.title.length > 1
    && form.title.length < 30
    && form.description.length > 1
    && form.description.length < 100
    && form.price !== ""
    && /^[0-9.]+$/.test(form.price)
    && form.price.length < 40;
}