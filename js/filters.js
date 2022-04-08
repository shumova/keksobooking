import {
  mapFilters,
  typeFilter,
  priceFilter,
  roomsFilter,
  guestsFilter
} from './constants.js';

// Данные для фильтрации карточек

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


const checkedFeatures = [];
const updateCheckedFeatures = () => {
  const featureFilters = Array.from(mapFilters.querySelectorAll('.map__checkbox'));
  featureFilters.forEach((feature) => {
    if (feature.checked) {
      checkedFeatures.push(feature);
    }
  });
};
const isFitFeatures = (card) => {
  let isEveryFeature;
  if (checkedFeatures.length > 0 && card.offer.features) {
    isEveryFeature = checkedFeatures.every((feature) => card.offer.features.indexOf(feature.value) >= 0);
  }
  return (checkedFeatures.length === 0) || isEveryFeature;
};

const CARDS_LENGTH = 10;

const filterCards = (data) => {
  const newData = [];
  for(let i = 0; i < data.length; i++) {
    if (isFitType(data[i]) && isFitPrice(data[i]) && isFitRooms(data[i]) && isFitGuests(data[i]) && isFitFeatures(data[i])) {
      if (newData.length === CARDS_LENGTH) {
        break;
      }
      newData.push(data[i]);
    }
  }
  return newData;
};

export {filterCards, updateCheckedFeatures};
