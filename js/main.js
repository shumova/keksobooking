
const ADS_LENGTH = 10;

const AVATAR_NUMBERS = createAvatarNumbers(ADS_LENGTH);

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

const CHECKIN_VARIANTS = ['12:00', '13:00', '14:00'];
const CHECKOUT_VARIANTS = ['12:00', '13:00', '14:00'];

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

// Получение случайного целого числа в заданном интервале, включительно
const getRandomInteger = (min = 0, max = 1000000) => {
  if ((min < 0 || max < 0 || max < min) || (!Number.isInteger(max) && !Number.isInteger(min) && max - min < 1)) {
    return 'Введены некорректные данные';
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Получение случайного числа с плавающей точкой в заданном интервале, включительно
const getRandomFractional = (min, max, fraction) => {
  if (fraction === 0) {
    return getRandomInteger (min, max);
  }

  if ((min < 0 || max < 0 || max < min || fraction < 0) || (!Number.isInteger(max) && !Number.isInteger(min) && max - min < 1 && fraction === 0)) {
    return 'Введены некорректные данные';
  }

  let fractionCorrection = 1;
  for (let i = 0; i < fraction; i++) {
    fractionCorrection *= 10;
  }
  max *= fractionCorrection;
  min *= fractionCorrection;
  return Math.trunc(Math.random() * (max - min + 1) + min) / fractionCorrection;
};

//Создание массива с номерами аватарок и генерация URL для аватарки

function createAvatarNumbers(length) {
  const avatarNumbers = [];
  for (let i = 1; i <= length; i++) {
    avatarNumbers.push(i);
  }
  return avatarNumbers;
}

const getAvatarUrl = (numbers) => {
  const numbersLength = numbers.length;
  if (numbersLength >= 1) {
    const numberIndex = getRandomInteger(0, numbersLength - 1);
    const number = numbers.splice(numberIndex, 1);
    const avatarNumber = number < 10 ? 0 + number.toString() : number.toString();
    return `img/avatars/user${avatarNumber}.png`;
  }
  return 'Изображение не найдено.';
};

//Получение случайного элемента, неповторяющегося элемента и массива элементов

const getRandomArrayElement = (elements) => {
  const elementIndex = getRandomInteger(0, elements.length - 1);
  return elements[elementIndex];
};

const getRandomUniqueArrayElement = (elements) => {
  const elementsLength = elements.length;
  if (elementsLength >= 1) {
    const elementIndex = getRandomInteger(0, elementsLength - 1);
    return elements.splice(elementIndex, 1).join();
  }
  return 'Данные не найдены.';
};

const getRandomArrayElements = (allElements) => {
  const allLocalElements = allElements.slice();
  const offerElements = [];
  const offerElementsLength = getRandomInteger(1, allLocalElements.length);
  for (let i = 0; i < offerElementsLength; i++) {
    const elementIndex = getRandomInteger(0, allLocalElements.length - 1);
    const offerElement = allLocalElements.splice(elementIndex, 1).join();
    offerElements.push(offerElement);
  }
  return offerElements;
};

// Создание объявления

const createAdvertisement = () => {
  const location = {
    lat: getRandomFractional(LAT_COORDINATES_MIN, LAT_COORDINATES_MAX, LAT_COORDINATES_FRACTION),
    lng: getRandomFractional(LNG_COORDINATES_MIN, LNG_COORDINATES_MAX, LNG_COORDINATES_FRACTION)
  };

  return {
    author: {
      avatar: getAvatarUrl(AVATAR_NUMBERS)
    },
    offer: {
      address: `${location.lat}, ${location.lng}`,
      title: getRandomUniqueArrayElement(OFFER_TITLES),
      price: getRandomInteger(),
      type: getRandomArrayElement(OFFER_TYPES),
      rooms: getRandomInteger(),
      guests: getRandomInteger(),
      checkin: getRandomArrayElement(CHECKIN_VARIANTS),
      checkout: getRandomArrayElement(CHECKOUT_VARIANTS),
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

const similarAds = Array.from({length: ADS_LENGTH}, createAdvertisement);

console.log(similarAds);
