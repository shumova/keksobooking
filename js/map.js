import {renderCard} from './render-card.js';
import {getData} from './api.js';
import {showAlert, debounce} from './utils.js';
import {
  adForm,
  mapFilters,
  interactiveElements,
  resetButton,
  filtersForm
} from './constants.js';
import {resetPhotos} from './photos.js';
import {
  filterCards,
  updateCheckedFeatures
} from './filters.js';

// Блокировка страницы

const activatePage = (shouldActivate) => {
  adForm.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  mapFilters.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  interactiveElements.forEach((child) => child[shouldActivate ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled'));
};

activatePage(false);

// Инициализация карты

const COORDS = {
  lat: 35.652832,
  lng: 139.839478,
};

const CREATION_DELAY = 500;
let dataCache = [];

// Активация страницы

const map = L.map('map-canvas')
  .on('load', () => {
    activatePage(true);
    getData(
      'https://25.javascript.pages.academy/keksobooking/data',
      (cards) => {
        dataCache = cards;
        setCards();
      },
      () => {
        showAlert('data-load-error');
        mapFilters.classList.add('ad-form--disabled');
      }
    );
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

// Получение адреса текущего pin
const getCurrentAddress = (pin) => Object.values(pin.getLatLng()).map((item) => item.toFixed(5)).join(', ');
const addressField = document.querySelector('.ad-form').querySelector('#address');

// Обновление данных
const onFilterChange = () => {
  updateCheckedFeatures();
  setCards();
};

// Очистка данных
const resetData = () => {
  adForm.reset();
  mapFilters.reset();
  resetPhotos();
  setCards();

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

function setCards() {
  markerGroup.clearLayers();
  const filteredData = filterCards(dataCache);
  filteredData.forEach((card) => createMarker(card), CREATION_DELAY);
}

addressField.value = getCurrentAddress(mainPinMarker);

mainPinMarker.on('moveend', (evt) => {
  const currentAddress = evt.target;
  addressField.value = getCurrentAddress(currentAddress);
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetData();
});

// Обработка изменений фильтрации
filtersForm.addEventListener('change', debounce(onFilterChange, 500));

export {resetData};
