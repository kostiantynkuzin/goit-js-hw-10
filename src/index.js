import './css/styles.css';
import { CountriesService } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const ulList = document.querySelector('.country-list');
const divInfo = document.querySelector('.country-info');
const countriesService = new CountriesService();

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  if (event.target.value.trim() === '') {
    clearPage();
    return;
  }
  countriesService.searchInput = event.target.value.trim();
  countriesService
    .fetchCountries()
    .then(data => renderMarkup(data))
    .catch(handleError);
}
const handleError = () => {
  Notify.failure('Oops, there is no country with that name');
};

function markUpOneCountry(data) {
  return data
    .map(country => {
      return `<img src="${
        country.flags.svg
      }" alt="Flag" width="30" height="24"></img>
                <h2 class="country-info-title">${country.name.official}</h2>
            <p>Capital: <span>${
              country.capital
            }</span></p><p>Population: <span>${
        country.population
      }</span></p><p>Languages: <span>${Object.values(
        country.languages
      )}</span></p>`;
    })
    .join('');
}

function markUpSeveralCountries(data) {
  return data
    .map(country => {
      return `<li class="country-list-item"><img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img>${country.name.official}</li>`;
    })
    .join('');
}

function renderMarkup(data) {
  clearPage();
  if (data.length === 1) {
    refs.divInfo.insertAdjacentHTML('beforeend', markUpOneCountry(data));
  } else if (data.length > 1 && data.length <= 10) {
    refs.ulList.insertAdjacentHTML('beforeend', markUpSeveralCountries(data));
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function clearPage() {
  ulList.innerHTML = '';
  divInfo.innerHTML = '';
}
