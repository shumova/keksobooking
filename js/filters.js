import {
  mapFilters,
  typeFilter,
  priceFilter,
  roomsFilter,
  guestsFilter
} from './elements.js';

const CARDS_LENGTH = 10;

const FilterValue = {
  ANY: 'any',
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high'
};

// Данные для фильтрации карточек

const isFitType = (card) => (card.offer.type.toString() === typeFilter.value.toString()) || (typeFilter.value.toString() === FilterValue.ANY);

const isFitPrice = (card) => {
  const cardPrice = card.offer.price;
  let priceLevel = '';
  if (cardPrice < 10000) {
    priceLevel = FilterValue.LOW;
  } else if (cardPrice >= 10000 & cardPrice < 50000) {
    priceLevel = FilterValue.MIDDLE;
  } else if (cardPrice >= 50000) {
    priceLevel = FilterValue.HIGH;
  }

  return (priceLevel === priceFilter.value) || (priceFilter.value === FilterValue.ANY);
};

const isFitRooms = (card) => (card.offer.rooms.toString() === roomsFilter.value.toString()) || (roomsFilter.value.toString() === FilterValue.ANY);
const isFitGuests = (card) => (card.offer.guests.toString() === guestsFilter.value.toString()) || (guestsFilter.value.toString() === FilterValue.ANY);

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
