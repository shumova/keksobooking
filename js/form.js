import {similarCards} from './mock.js';
import {addContent} from './utils.js';

const adForm = document.querySelector('.ad-form');
const resetButton = document.querySelector('.ad-form__reset');

// данные для активации страницы

const mapFilters = document.querySelector('.map__filters');
const sliderElement = document.querySelector('.ad-form__slider');
const interactiveElements = Array.from(adForm.children).concat(Array.from(mapFilters.children), sliderElement);

const activatePage = (shouldActivate) => {
  adForm.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  mapFilters.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  interactiveElements.forEach((child) => child[shouldActivate ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled'));
};

activatePage(false);

//инициализация карты

const map = L.map('map-canvas')
  .on('load', () => {
    activatePage(true);
  })
  .setView({
    lat: 35.652832,
    lng: 139.839478,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

// создание главной метки

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: 35.652832,
    lng: 139.839478,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  }
);

mainPinMarker.addTo(map);

// создание обычных меток

const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// данные для рендера карточек

const RoomsType = {
  FLAT: 'Квартира',
  BUNGALOW: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец',
  HOTEL: 'Отель'
};

const renderCard = ({author, offer}) => {

  const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__avatar').src = author.avatar;
  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').insertAdjacentHTML('afterbegin', `${offer.price} `);

  addContent(cardElement.querySelector('.popup__type'), RoomsType[offer.type.toUpperCase()]);
  addContent(cardElement.querySelector('.popup__description'), offer.description);
  addContent(cardElement.querySelector('.popup__text--capacity'), `${offer.rooms} комнаты для ${offer.guests} гостей`);
  addContent(cardElement.querySelector('.popup__text--time'), `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`);

  const featuresList = cardElement.querySelector('.popup__features');
  featuresList.textContent = '';
  offer.features.map((item) => {
    const featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', `popup__feature--${item}`);
    featureItem.textContent = item;
    featuresList.appendChild(featureItem);
  });

  const gallery = cardElement.querySelector('.popup__photos');
  offer.photos.forEach((item) => {
    if (item) {
      const cardPhoto = document.createElement('img');
      cardPhoto.classList.add('popup__photo');
      cardPhoto.src = item;
      cardPhoto.width = 45;
      cardPhoto.height = 40;
      cardPhoto.alt = 'Фотография жилья';
      gallery.appendChild(cardPhoto);
    } else {
      gallery.remove();
    }
  });

  return cardElement;
};

// создание слоя с метками

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (card) => {
  const lat = card.offer.location.lat;
  const lng = card.offer.location.lng;
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

similarCards.forEach((card) => {
  createMarker(card);
});

// возвращение маркера в исходное положение

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();

  markerGroup.clearLayers();

  mainPinMarker.setLatLng({
    lat: 35.652832,
    lng: 139.839478,
  });
  map.setView({
    lat: 35.652832,
    lng: 139.839478,
  }, 12);
});

// получение адреса текущего pin

const getCurrentAddress = (pin) => Object.values(pin.getLatLng()).map((item) => item.toFixed(5)).join(', ');
const addressField = adForm.querySelector('#address');

addressField.value = getCurrentAddress(mainPinMarker);

mainPinMarker.on('moveend', (evt) => {
  const currentAddress = evt.target;
  addressField.value = getCurrentAddress(currentAddress);
});

// инициализация валидатора

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__error'
});

// данные для валидации цены

const priceField = adForm.querySelector('#price');
const MinPrice = {
  BUNGALOW: 0,
  FLAT: 1000,
  HOTEL: 3000,
  HOUSE: 5000,
  PALACE: 10000
};

const validatePrice = (value) => {
  const unit = adForm.querySelector('[name="type"]');
  return value.length && value >= MinPrice[unit.value.toUpperCase()];
};

const getPriceErrorMessage = () => {
  const unit = adForm.querySelector('[name="type"]');
  return `Минимальная цена, руб.: ${MinPrice[unit.value.toUpperCase()]}`;
};

const onTypeChange = (evt) => {
  priceField.placeholder = MinPrice[evt.target.value.toUpperCase()];
  pristine.validate(priceField);
};

adForm
  .querySelectorAll('[name="type"]')
  .forEach((item) => item.addEventListener('change', onTypeChange));

pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

// инициализация слайдера для цены и его валидация

priceField.value = 1000;

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100000,
  },
  start: 1000,
  step: 1,
  connect: 'lower',

  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },

});

sliderElement.noUiSlider.on('update', () => {
  priceField.value = sliderElement.noUiSlider.get();
  pristine.validate(priceField);
});

// данные для валидации комнат-вместимости

const roomsField = adForm.querySelector('#room_number');
const capacityField = adForm.querySelector('#capacity');
const roomsOption = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const onRoomsChange = () => {
  pristine.validate(capacityField);
};

adForm
  .querySelectorAll('[name="rooms"]')
  .forEach((item) => item.addEventListener('change', onRoomsChange));

adForm
  .querySelectorAll('[name="capacity"]')
  .forEach((item) => item.addEventListener('change', onRoomsChange));

const validateRooms = () => roomsOption[roomsField.value].includes(capacityField.value);

const getRoomsErrorMessage = () => `Максимальная вместимость, человек: ${roomsField.value === '100' ? 'не для гостей' : roomsField.value}`;

pristine.addValidator(roomsField, validateRooms);
pristine.addValidator(capacityField, validateRooms, getRoomsErrorMessage);

//для проверки времени заезда-выезда

const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');

const onTimeChange = (evt) => {
  const dependentField = evt.target.id === 'timein' ? timeOutField : timeInField;
  dependentField.value = evt.target.value;
};

timeInField.addEventListener('change', onTimeChange);
timeOutField.addEventListener('change', onTimeChange);

// валидация формы
adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
