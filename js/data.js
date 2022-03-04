import {getRandomNumber, getRandomArrayElement, getRandomUniqueArrayElement, getRandomArrayElements} from './util.js';

const ADS_LENGTH = 10;

const OFFER_TITLES = [
  'Фрегат',
  'Космос',
  'Ладога',
  'Саквояж',
  '9 ночей',
  'Турист Инн',
  'ЭКО&LOFT',
  'Holiday Home',
  'Акватика',
  'Brusnika Hotel'
];

const LAT_COORDINATES_MIN = 35.65000;
const LAT_COORDINATES_MAX = 35.70000;
const LAT_COORDINATES_FRACTION = 5;
const LNG_COORDINATES_MIN = 139.70000;
const LNG_COORDINATES_MAX = 139.80000;
const LNG_COORDINATES_FRACTION = 5;

const OFFER_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel'
];

const TIME_VARIANTS = ['12:00', '13:00', '14:00'];

const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

const DESCRIPTIONS = [
  'Расположение в тихом месте в центре Петрозаводска, на живописном берегу Онежского озера. К услугам гостей ресторан и охраняемая парковка.',
  'Здание отеля построено в форме корабля, а из окон открывается панорамный вид.',
  'Номера располагают местом для работы и собственной ванной комнатой. Все номера оснащены телевизором с кабельными каналами.',
  'Деревня Вилга находится в 13 км, а город Кондопога — в 46 км. Расстояние до международного аэропорта составляет 18 км.',
  'Мы находимся в 600 м от парка имени 50-летия пионерской организации и в 2 км от парка Победы.',
  'Парам особенно нравится расположение — они оценили проживание в этом районе для поездки вдвоем на 8,8.',
  'Возможно проживание с домашними животными.',
  'К услугам гостей крытый бассейн, фитнес-центр и круглосуточная стойка регистрации.',
  'К услугам гостей — бизнес-центр. В экскурсионном бюро помогут организовать экскурсии и туры.',
  'В ресторане сервируют завтрак «шведский стол», а также предлагают блюда европейской и русской кухни. Тренажерный зал и лобби-бар работают круглосуточно.'
];

const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];

// Создание объявления

const createAdvertisement = (index) => {
  const location = {
    lat: getRandomNumber(LAT_COORDINATES_MIN, LAT_COORDINATES_MAX, LAT_COORDINATES_FRACTION),
    lng: getRandomNumber(LNG_COORDINATES_MIN, LNG_COORDINATES_MAX, LNG_COORDINATES_FRACTION)
  };

  const currentIndex = index + 1;

  return {
    author: {
      avatar: `img/avatars/user${(currentIndex.toString()).padStart(2, '0')}.png`
    },
    offer: {
      address: `${location.lat}, ${location.lng}`,
      title: getRandomUniqueArrayElement(OFFER_TITLES),
      price: getRandomNumber(),
      type: getRandomArrayElement(OFFER_TYPES),
      rooms: getRandomNumber(),
      guests: getRandomNumber(),
      checkin: getRandomArrayElement(TIME_VARIANTS),
      checkout: getRandomArrayElement(TIME_VARIANTS),
      features: getRandomArrayElements(FEATURES),
      description: getRandomUniqueArrayElement(DESCRIPTIONS),
      photos: getRandomArrayElements(PHOTOS),
      location: {
        lat: location.lat,
        lng: location.lng
      }
    }
  };
};

const createAds = () => Array.from({length: ADS_LENGTH}).map((i, index) => createAdvertisement(index));

export {createAds};
