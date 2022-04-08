const avatarChooser = document.querySelector('.avatar__input');
const avatarPreview = document.querySelector('.avatar__photo');
const offerPhotosChooser = document.querySelector('.ad-form__input');
const offerPhotosPreview = document.querySelector('.ad-form__photo');
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const MAX_PHOTO_QUANTITY = 6;

let currentQuantity = 0;
const resetPhotos = () => {
  offerPhotosPreview.textContent = '';
  avatarPreview.src = 'img/muffin-grey.svg';
  offerPhotosChooser.removeAttribute('disabled', 'disabled');
  currentQuantity = 0;
};

avatarChooser.addEventListener('change', () => {
  const file = avatarChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

offerPhotosChooser.addEventListener('change', () => {
  const files = Array.from(offerPhotosChooser.files);
  files.forEach((file) => {
    currentQuantity++;
    if (currentQuantity <= MAX_PHOTO_QUANTITY) {
      const photoElement = document.createElement('img');
      photoElement.src = URL.createObjectURL(file);
      photoElement.alt = 'Фотография объекта';
      photoElement.width = 70;
      photoElement.height = 70;
      photoElement.classList.add('ad-form__photo-item');
      offerPhotosPreview.insertAdjacentElement('beforeend', photoElement);
    }

    if (currentQuantity === MAX_PHOTO_QUANTITY) {
      offerPhotosChooser.setAttribute('disabled', 'disabled');
      let photoAlarm = offerPhotosPreview.querySelector('#photo-alarm');
      if (!photoAlarm) {
        photoAlarm = document.createElement('span');
        photoAlarm.id = 'photo-alarm';
        photoAlarm.textContent = 'Загружено максимально возможное количество изображений';
        offerPhotosPreview.insertAdjacentElement('beforeend', photoAlarm);
      }
    }
  });
});

export {resetPhotos};
