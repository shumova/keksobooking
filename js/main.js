import './popup.js';
import './form.js';

import {similarCards} from './mock.js';
import {RoomsType} from './popup.js';

const addContent = (element, content) => {
  if (content && !content.includes('undefined'))  {
    element.textContent = content;
  } else {
    element.remove();
  }
};

const renderCard = ({author, offer}) => {

  const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  const map = document.querySelector('#map-canvas');
  const similarListFragment = document.createDocumentFragment();
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__avatar').src = author.avatar;
  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').insertAdjacentHTML('afterbegin', `${offer.price} `);

  addContent(cardElement.querySelector('.popup__type'), RoomsType[offer.type.toUpperCase()]);
  addContent(cardElement.querySelector('.popup__description'), offer.description);
  addContent(cardElement.querySelector('.popup__text--capacity'), `${offer.rooms} комнаты для ${offer.guests} гостей`);
  addContent(cardElement.querySelector('.popup__text--time'), `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`);

  const featuresList = cardElement.querySelector('.popup__features');
  featuresList.textContent = '';
  offer.features.map((item) => {
    const featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', `popup__feature--${item}`);
    featureItem.textContent = item;
    featuresList.appendChild(featureItem);
  });

  const gallery = cardElement.querySelector('.popup__photos');
  offer.photos.forEach((item) => {
    if (item) {
      const cardPhoto = document.createElement('img');
      cardPhoto.classList.add('popup__photo');
      cardPhoto.src = item;
      cardPhoto.width = 45;
      cardPhoto.height = 40;
      cardPhoto.alt = 'Фотография жилья';
      gallery.appendChild(cardPhoto);
    } else {
      gallery.remove();
    }
  });

  similarListFragment.appendChild(cardElement);
  map.appendChild(similarListFragment);
};

renderCard(similarCards[0]);
