import {
  getElement,
  generateSearchList,
  generateBookResult,
  addClass,
  removeClass,
  emptyElement,
  createBookThumbnails,
  show,
  hide,
  setElementText,
} from './utils';
import { recentlyAdded } from './books';

// Filtering & AutoComplete Factory function
export function initialiseSearchInput(inputElement) {
  // Generate initial search list
  const bookList = generateSearchList(recentlyAdded);
  const searchResults = getElement('.searchbar__results');
  const defaultView = getElement('.main-body__default-view');
  const filteredView = getElement('.main-body__filtered-view');
  const filteredBooksList = getElement('.filtered-books ul');
  const filteredBooksHeader = getElement('.filtered-books h2');
  let searchResultsList;
  let value;

  // Event Listeners
  // Execute the autoComplete when a user interacts with the input field
  inputElement.addEventListener('input', function () {
    value = this.value;

    // Initialise results
    emptyElement(searchResults);

    if (!value) {
      // Hide search results from view
      removeClass(searchResults, 'active');
      return false;
    }

    // Generate filtered book list that contains search parameter
    const filteredbookList = bookList.filter((book) => book.bookString.toLowerCase().includes(value.toLowerCase()));

    searchResults.innerHTML = filteredbookList
      .map((book) => {
        const { bookString, bookDetails } = book;
        // Generate unique autocomplete option look
        const bookResult = generateBookResult(bookString, value);

        return `
          <button onclick="filterBookDetail('${bookDetails.title}', '${value}')">${bookResult}</button>
        `;
      })
      .join('');

    show(searchResults);
    addClass(searchResults, 'active');

    // Set results for Filtered View
    searchResultsList = filteredbookList.map((book) => book.bookDetails);
  });

  getElement('.searchbar-icon').addEventListener('click', function () {
    // Switch to Filtered View with results
    filterBooks(searchResultsList);
  });

  getElement('.main-body__filtered-view .back-button').addEventListener('click', function () {
    // Return to Default View and reset search
    clearFilterView();
  });

  // Close Search Results another element is clicked
  document.addEventListener('click', function () {
    hide(searchResults);
    removeClass(searchResults, 'active');
    emptyElement(searchResults);
  });

  // Utility functions
  function clearFilterView() {
    show(defaultView);
    hide(filteredView);
    emptyElement(searchResults);
    removeClass(searchResults, 'active');
    setElementText(filteredBooksHeader, '');
    emptyElement(filteredBooksList);
  }

  function filterBooks(resultsList) {
    if (!value) {
      hide(filteredView);
      show(defaultView);
      return;
    }
    createBookThumbnails(resultsList, '.filtered-books ul');
    show(filteredView);
    hide(defaultView);
    setElementText(filteredBooksHeader, `Results for "${value}"`);
  }
}

export function filter() {}
