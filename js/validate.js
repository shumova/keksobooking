import {
  adForm,
  priceField
} from './constants.js';

// инициализация валидатора

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__error'
});

const validate = (element) => pristine.validate(element);

// данные для валидации цены

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
  validate(priceField);
};

adForm
  .querySelectorAll('[name="type"]')
  .forEach((item) => item.addEventListener('change', onTypeChange));

pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

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
  validate(capacityField);
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

// валидация формы

const validateForm = () => pristine.validate();

export {validateForm, validate};
