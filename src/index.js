import axios from "axios";
import Notiflix from "notiflix";

const refs = {
  searchForm: document.querySelector('#search-form'),
}

refs.searchForm.addEventListener('submit', searchHandler);

async function searchHandler(e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;

  if (searchQuery) {
    const response = await getImages(searchQuery);
    console.log(response);
  }

}


function getImages(query) {

  const params = {
    key: '34711882-d2bb8b31b4862e0108a3dd354',
    image_type: 'photo',
    q: query,
    orientation: 'horizontal',
    safesearch: true,
  }

  return axios.get('https://pixabay.com/api/', { params });
}
