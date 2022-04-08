import {
  adForm,
  sliderElement,
  priceField,
  submitButton
} from './constants.js';
import {validateForm, validate} from './validate.js';
import {resetData} from './map.js';
import {showAlert} from './utils.js';
import {sendData} from './api.js';

const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');

const MAX_PRICE = 100000;

const onTimeChange = (evt) => {
  const dependentField = evt.target.id === 'timein' ? timeOutField : timeInField;
  dependentField.value = evt.target.value;
};

// Блокировка кнопки отправки формы

const blockSubmitButton = (shouldBlock) => {
  submitButton[shouldBlock ? 'setAttribute' : 'removeAttribute']('disabled', 'disabled');
  submitButton.textContent = shouldBlock ? 'Публикую' : 'Опубликовать';
};

// Для проверки времени заезда-выезда

timeInField.addEventListener('change', onTimeChange);
timeOutField.addEventListener('change', onTimeChange);

// Инициализация слайдера для цены

priceField.value = 1000;

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: MAX_PRICE,
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
  validate(priceField);
});

// Обработчик отправки формы

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = validateForm();
  if (isValid) {
    blockSubmitButton(true);
    sendData(
      'https://25.javascript.pages.academy/keksobooking',
      () => {
        resetData();

        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: MAX_PRICE,
          },
          start: 1000,
        });

        showAlert('success');
        blockSubmitButton(false);
      },
      () => {
        showAlert('error');
        blockSubmitButton(false);
      },
      new FormData(evt.target)
    );
  }
});
