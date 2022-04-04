import {renderCard} from './render-card.js';
import {getData} from './api.js';
import {showAlert} from './utils.js';
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

const CARDS_LENGTH = 10;

const setMarkers = () => {
  getData(
    (cards) => cards.slice(0, CARDS_LENGTH).forEach((card) => createMarker(card)),
    () => showAlert('data-load-error')
  );
};

setMarkers();

// Очистка данных
const resetData = () => {
  markerGroup.clearLayers();

  setMarkers();

  mainPinMarker.setLatLng({
    lat: COORDS.lat,
    lng: COORDS.lng,
  });
  map.setView({
    lat: COORDS.lat,
    lng: COORDS.lng,
  }, 12);

  addressField.value = getCurrentAddress(mainPinMarker);
  document.querySelector('#title').value = '';
  document.querySelector('#description').value = '';
  document.querySelector('#type').value = 'flat';
  document.querySelector('#price').value = '1000';
  document.querySelector('#room_number').value = '1';
  document.querySelector('#capacity').value = '1';
  document.querySelector('#timein').value = '12:00';
  document.querySelector('#timeout').value = '12:00';
  document.querySelectorAll('.features__checkbox').forEach((feature) => {feature.checked = false;});

  document.querySelector('#housing-type').value = 'any';
  document.querySelector('#housing-price').value = 'any';
  document.querySelector('#housing-rooms').value = 'any';
  document.querySelector('#housing-guests').value = 'any';
  document.querySelectorAll('.map__checkbox').forEach((feature) => {feature.checked = false;});
};

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetData();
});

export {resetData};
