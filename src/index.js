import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a');

const errorMessage = 'Sorry, there are no images matching your search query. Please try again.';
const messageInTheEnd = "We're sorry, but you've reached the end of search results.";

const params = {
  key: '34711882-d2bb8b31b4862e0108a3dd354',
  image_type: 'photo',
  q: '',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
}


const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', searchHandler);
refs.loadMoreButton.addEventListener('click', loadMoreHendler);

async function searchHandler(event) {
  event.preventDefault();

  params.page = 1;
  params.q = event.target.searchQuery.value;

  const response = await axios.get('https://pixabay.com/api/', { params });

  if (response.data.hits.length) {
    const markup = makeMarkup(response);
    refs.gallery.innerHTML = markup;
    refs.loadMoreButton.classList.remove('hidden');
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    lightbox.refresh();
  } else {
    Notify.failure(errorMessage);
  }
};

function makeMarkup(response) {
  let newMarkup = '';
  response.data.hits.forEach(picture => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = picture;

    newMarkup += 
      `<a class="photo-link" href="${largeImageURL}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${likes}
            </p>
            <p class="info-item">
              <b>Views</b>${views}
            </p>
            <p class="info-item">
              <b>Comments</b>${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${downloads}
            </p>
          </div>
      </div></a>`;
  });
  return newMarkup;
 };


async function loadMoreHendler() {
  params.page += 1;
  const response = await axios.get('https://pixabay.com/api/', { params });

  if (response.data.hits.length) {
    const markup = makeMarkup(response);
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
  }

  if (params.page > 12 || response.data.hits.length < 40) {
    Notify.info(messageInTheEnd);
    refs.loadMoreButton.classList.add('hidden');
  }
};

