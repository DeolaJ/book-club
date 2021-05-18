import { recentlyAdded, allBooks, featuredBooks } from './books';
import {
  createBookCards,
  createBookThumbnails,
  initialiseStickyElements,
  initialiseCarousel,
  getElement,
  show,
  hide,
  getElements,
  toggleVisibility,
  toggleClass,
  setElementText,
} from './utils';
import { initialiseSearchInput } from './filter';

const recentlyAddedGrid = '.recently-added .books-grid';
const allBooksGrid = '.all-books .books-grid';
const featuredBooksGrid = '.featured-books .books-carousel';
const searchControls = [getElement('.mobile-search-toggle'), getElement('.nav .back-button button')];
const thumbnailControls = [getElement('.books-carousel'), getElement('.filtered-books ul')];

// Initialise Book Cards and Thumbnails
createBookThumbnails(featuredBooks, featuredBooksGrid);
createBookCards(recentlyAdded, recentlyAddedGrid);
createBookCards(allBooks, allBooksGrid);

// Polyfill for Position Sticky
initialiseStickyElements('.sticky-container');

// Initialise the Flickity Carousel
initialiseCarousel(featuredBooksGrid);

// Event Listeners for Page Interactions
// Open Mobile Sidebar
getElement('.nav__sidebar-button').addEventListener('click', function () {
  getElement('.sidebar').classList.add('visible');
  show(getElement('.main-body__overlay'));
});

// Close Mobile Sidebar
getElement('.sidebar .back-button button').addEventListener('click', function () {
  getElement('.sidebar').classList.remove('visible');
  hide(getElement('.main-body__overlay'));
});

// Show Overlay when Mobile Sidebar is active
getElement('.main-body__overlay').addEventListener('click', function () {
  getElement('.sidebar').classList.remove('visible');
  hide(getElement('.main-body__overlay'));
});

// Show/Hide Mobile Book Thumbnail Details
thumbnailControls.forEach((thumbnailControl) => {
  thumbnailControl.addEventListener('click', function (e) {
    const element = e.targetElement || e.srcElement;
    const parent = element.parentNode;
    const bookThumbnail = parent.parentNode;

    if (parent.classList.contains('book-thumbnail__control')) {
      parent.querySelectorAll('div').forEach((element) => {
        toggleVisibility(element);
      });
      toggleClass(bookThumbnail, 'mobile');
    }
  });
});

// Mobile Search View Controls
searchControls.forEach((searchControl) => {
  searchControl.addEventListener('click', function () {
    getElements('.nav__menu-item').forEach((element) => {
      if (element.classList.contains('nav__searchbar')) {
        toggleClass(element, 'desktop-only');
      } else {
        toggleVisibility(element);
      }
    });
    toggleClass(getElement('.nav'), 'searching');
  });
});

// Initialise Searching and AutoComplete
initialiseSearchInput(getElement('#search-input'));

// Global function to enable each search result option to be selected
window.filterBookDetail = function filterBookDetail(title, searchValue) {
  const result = recentlyAdded.filter((book) => book.title === title);
  createBookThumbnails(result, '.filtered-books ul');
  show(getElement('.main-body__filtered-view'));
  hide(getElement('.main-body__default-view'));
  setElementText(getElement('.filtered-books h2'), `Selected Result for "${searchValue}"`);
};
