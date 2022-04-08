const adForm = document.querySelector('.ad-form');
const sliderElement = document.querySelector('.ad-form__slider');
const priceField = adForm.querySelector('#price');
const submitButton = adForm.querySelector('.ad-form__submit');
const mapFilters = document.querySelector('.map__filters');
const interactiveElements = Array.from(adForm.children).concat(Array.from(mapFilters.children), sliderElement);
const resetButton = document.querySelector('.ad-form__reset');
const filtersForm = document.querySelector('.map__filters');
const typeFilter = mapFilters.querySelector('#housing-type');
const priceFilter = mapFilters.querySelector('#housing-price');
const roomsFilter = mapFilters.querySelector('#housing-rooms');
const guestsFilter = mapFilters.querySelector('#housing-guests');

export {
  adForm,
  sliderElement,
  priceField,
  submitButton,
  mapFilters,
  interactiveElements,
  resetButton,
  filtersForm,
  typeFilter,
  priceFilter,
  roomsFilter,
  guestsFilter
};
