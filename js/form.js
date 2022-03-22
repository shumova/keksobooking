const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const slider = document.querySelector('.ad-form__slider');
const interactiveElements = Array.from(adForm.children).concat(Array.from(mapFilters.children), slider);

const deactivatePage = () => {
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');
  interactiveElements.forEach((child) => child.setAttribute('disabled', 'disabled'));
};

const activatePage = () => {
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  interactiveElements.forEach((child) => child.removeAttribute('disabled'));
};

deactivatePage();
activatePage();
