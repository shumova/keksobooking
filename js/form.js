const adForm = document.querySelector('.ad-form');

// константы для активации/деактивации страницы
const mapFilters = document.querySelector('.map__filters');
const slider = document.querySelector('.ad-form__slider');
const interactiveElements = Array.from(adForm.children).concat(Array.from(mapFilters.children), slider);

const activatePage = (shouldActivate) => {
  adForm.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  mapFilters.classList[shouldActivate ? 'remove' : 'add']('ad-form--disabled');
  interactiveElements.forEach((child) => child[shouldActivate ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled'));
};

// константы и функции для валидации

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__error'
}, false);

//для валидации цены

const price = adForm.querySelector('#price');
const minPrice = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

function validatePrice (value) {
  const unit = adForm.querySelector('[name="type"]');
  return value.length && value >= minPrice[unit.value];
}

function getPriceErrorMessage () {
  const unit = adForm.querySelector('[name="type"]');
  return `Минимальная цена, руб.: ${minPrice[unit.value]}`;
}

function onTypeChange () {
  price.placeholder = minPrice[this.value];
  pristine.validate(price);
}

adForm
  .querySelectorAll('[name="type"]')
  .forEach((item) => item.addEventListener('change', onTypeChange));

pristine.addValidator(price, validatePrice,getPriceErrorMessage);

//для валидации комнат-вместимости

const roomsField = adForm.querySelector('[name="rooms"]');
const capacityField = adForm.querySelector('[name="capacity"]');
const roomsOption = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['100']
};

function validateRooms () {
  return roomsOption[roomsField.value].includes(capacityField.value);
}

function getRoomsErrorMessage () {
  return `
  Максимальная вместимость, человек:
  ${roomsField.value === '100' ? 'не для гостей' : roomsField.value}
  `;
}

pristine.addValidator(roomsField, validateRooms);
pristine.addValidator(capacityField, validateRooms, getRoomsErrorMessage);

//для проверки времени заезда-выезда
const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');

function onTimeChange() {
  const dependentField = this.id === 'timein' ? timeOutField : timeInField;
  dependentField.value = this.value;
}

timeInField.addEventListener('change', onTimeChange);
timeOutField.addEventListener('change', onTimeChange);

// активация страницы
activatePage(false);
activatePage(true);

// валидация формы
adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});

