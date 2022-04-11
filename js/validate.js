import {
  adForm,
  priceField
} from './elements.js';

const MinPrice = {
  BUNGALOW: 0,
  FLAT: 1000,
  HOTEL: 3000,
  HOUSE: 5000,
  PALACE: 10000
};

const RoomsOption = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

// инициализация валидатора

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__error'
});

const validate = (element) => pristine.validate(element);

// данные для валидации цены

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

// данные для валидации комнат-вместимости

const roomsField = adForm.querySelector('#room_number');
const capacityField = adForm.querySelector('#capacity');

const onRoomsChange = () => {
  validate(capacityField);
};

const validateRooms = () => RoomsOption[roomsField.value].includes(capacityField.value);

const getRoomsErrorMessage = () => `Максимальная вместимость, человек: ${roomsField.value === '100' ? 'не для гостей' : roomsField.value}`;

// для валидации формы
const validateForm = () => pristine.validate();

// сброс ошибок
const resetValidation = () => pristine.reset();

// валидация цены при смене типа

adForm
  .querySelectorAll('[name="type"]')
  .forEach((item) => item.addEventListener('change', onTypeChange));

pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

// валидация комнат-вместимости

adForm
  .querySelectorAll('[name="rooms"]')
  .forEach((item) => item.addEventListener('change', onRoomsChange));

adForm
  .querySelectorAll('[name="capacity"]')
  .forEach((item) => item.addEventListener('change', onRoomsChange));

pristine.addValidator(roomsField, validateRooms);
pristine.addValidator(capacityField, validateRooms, getRoomsErrorMessage);

export {validateForm, validate, resetValidation};
