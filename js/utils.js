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
const getRandomNumber = (min = 0, max = 1000000, fraction = 0) => {
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

// Проверка и добавление данных в элемент

const addContent = (element, content) => {
  if (content && !content.includes('undefined'))  {
    element.textContent = content;
  } else {
    element.remove();
  }
};

export {getRandomNumber, getRandomArrayElement, getRandomUniqueArrayElement, getRandomArrayElements, addContent};

