import {renderCard} from './render-card.js';
import {getData} from './api.js';
import {showAlert, debounce} from './utils.js';
import {
  adForm,
  mapFilters,
  interactiveElements,
  resetButton
} from './constants.js';

// Блокировка страницы

const activatePage = (shouldActivate) => {
  adForm.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  mapFilters.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  interactiveElements.forEach((child) => child[shouldActivate ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled'));
};

activatePage(false);

// Инициализация карты и активация страницы

const COORDS = {
  lat: 35.652832,
  lng: 139.839478,
};

const map = L.map('map-canvas')
  .on('load', () => {
    activatePage(true);
  })
  .setView({
    lat: COORDS.lat,
    lng: COORDS.lng,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

// Создание главной метки

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: COORDS.lat,
    lng: COORDS.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  }
);

mainPinMarker.addTo(map);

// Создание обычных меток

const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Получение адреса текущего pin

const getCurrentAddress = (pin) => Object.values(pin.getLatLng()).map((item) => item.toFixed(5)).join(', ');
const addressField = document.querySelector('.ad-form').querySelector('#address');

addressField.value = getCurrentAddress(mainPinMarker);

mainPinMarker.on('moveend', (evt) => {
  const currentAddress = evt.target;
  addressField.value = getCurrentAddress(currentAddress);
});

// Создание слоя с метками

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (card) => {
  const lat = card.location.lat;
  const lng = card.location.lng;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(renderCard(card));
};

// Данные для фильтрации карточек

const typeFilter = mapFilters.querySelector('#housing-type');
const priceFilter = mapFilters.querySelector('#housing-price');
const roomsFilter = mapFilters.querySelector('#housing-rooms');
const guestsFilter = mapFilters.querySelector('#housing-guests');

const featureFilters = Array.from(mapFilters.querySelectorAll('.map__checkbox'));
const checkedFeatures = [];
const updateCheckedFeatures = (feature) => {
  if (feature.checked) {
    checkedFeatures.push(feature);
  } else {
    if (checkedFeatures.indexOf(feature)) {
      checkedFeatures.splice(checkedFeatures.indexOf(feature));
    }
  }
};

const isFitType = (card) => (card.offer.type.toString() === typeFilter.value.toString()) || (typeFilter.value.toString() === 'any');

const isFitPrice = (card) => {
  const cardPrice = card.offer.price;
  let priceLevel = '';
  if (cardPrice < 10000) {
    priceLevel = 'low';
  } else if (cardPrice >= 10000 & cardPrice < 50000) {
    priceLevel = 'middle';
  } else if (cardPrice >= 50000) {
    priceLevel = 'high';
  }

  return (priceLevel === priceFilter.value) || (priceFilter.value === 'any');
};

const isFitRooms = (card) => (card.offer.rooms.toString() === roomsFilter.value.toString()) || (roomsFilter.value.toString() === 'any');
const isFitGuests = (card) => (card.offer.guests.toString() === guestsFilter.value.toString()) || (guestsFilter.value.toString() === 'any');

const isFitFeatures = (card) => {
  let isEveryFeature;
  if (checkedFeatures.length > 0 && card.offer.features) {
    isEveryFeature = checkedFeatures.every((feature) => card.offer.features.indexOf(feature.value) >= 0);
  }
  return (checkedFeatures.length === 0) || isEveryFeature;
};

const CARDS_LENGTH = 10;
const CREATION_DELAY = 500;

const setMarkers = () => {
  getData(
    'https://25.javascript.pages.academy/keksobooking/data',
    (cards) => {
      markerGroup.clearLayers();
      cards.slice().filter(isFitType).filter(isFitPrice).filter(isFitRooms).filter(isFitGuests).filter(isFitFeatures).slice(0, CARDS_LENGTH).forEach((card) => debounce(createMarker(card), CREATION_DELAY));
    },
    () => {
      showAlert('data-load-error');
      mapFilters.classList.add('ad-form--disabled');
    }
  );
};

setMarkers();

mapFilters.querySelector('#housing-type').addEventListener('change', setMarkers);
mapFilters.querySelector('#housing-rooms').addEventListener('change', setMarkers);
mapFilters.querySelector('#housing-guests').addEventListener('change', setMarkers);
mapFilters.querySelector('#housing-price').addEventListener('change', setMarkers);
featureFilters.forEach((feature) => feature.addEventListener('change', () => {
  updateCheckedFeatures(feature);
  setMarkers();
}));

// Очистка данных

const resetData = () => {
  adForm.reset();
  mapFilters.reset();

  mainPinMarker.setLatLng({
    lat: COORDS.lat,
    lng: COORDS.lng,
  });
  map.setView({
    lat: COORDS.lat,
    lng: COORDS.lng,
  }, 12);

  addressField.value = getCurrentAddress(mainPinMarker);
};

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetData();
});

export {resetData};
