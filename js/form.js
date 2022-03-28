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

const onInputChange = (evt) => {
  pristine.validate(evt.target);
};

//для валидации заголовка

const title = adForm.querySelector('#title');

//для валидации цены

const price = adForm.querySelector('#price');
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
  price.placeholder = MinPrice[evt.target.value.toUpperCase()];
  pristine.validate(price);
};

adForm
  .querySelectorAll('[name="type"]')
  .forEach((item) => item.addEventListener('change', onTypeChange));

pristine.addValidator(price, validatePrice,getPriceErrorMessage);

//для валидации комнат-вместимости

const roomsField = adForm.querySelector('#room_number');
const capacityField = adForm.querySelector('#capacity');
const roomsOption = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['100']
};

const onRoomsChange = () => {
  pristine.validate(capacityField);
};

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

// активация страницы
activatePage(false);
activatePage(true);

// валидация формы
adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();

  title.addEventListener('keyup', onInputChange);
  price.addEventListener('keyup', onInputChange);
  adForm
    .querySelectorAll('[name="rooms"]')
    .forEach((item) => item.addEventListener('change', onRoomsChange));
  adForm
    .querySelectorAll('[name="capacity"]')
    .forEach((item) => item.addEventListener('change', onRoomsChange));
});
