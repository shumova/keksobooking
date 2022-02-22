// Получение случайного целого числа в заданном интервале, включительно
// источник основной функции: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInteger = (min, max) => {
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

getRandomInteger (1, 2);
getRandomFractional(1.1, 1.2, 5);
