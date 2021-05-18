import wheel from 'wheel';
import normalizeWheel from 'normalize-wheel';
import Stickyfill from 'stickyfilljs';
import Flickity from 'flickity';
import images from '../img/*.png';

// DOM Interaction utility functions
export function getElement(selector) {
  return document.querySelector(selector);
}

export function getElements(selector) {
  return document.querySelectorAll(selector);
}

export function hide(element) {
  element.classList.add('hide');
}

export function show(element) {
  element.classList.remove('hide');
}

export function toggleVisibility(element) {
  element.classList.toggle('hide');
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function removeClass(element, className) {
  element.classList.remove(className);
}

export function toggleClass(element, className) {
  element.classList.toggle(className);
}

export function emptyElement(element) {
  element.innerHTML = '';
}

export function setElementText(element, text) {
  element.textContent = text;
}

// Book Card & Thumbnail Utility functions
function getStars() {
  const greyStar = `
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.53965 0L8.41481 3.62102L12.5783 4.19917L9.55898 7.01383L10.2741 11L6.53965 9.12863L2.80521 11L3.52031 7.01383L0.500977 4.19917L4.68037 3.62102L6.53965 0Z"
        fill="#DDDDDD"
      />
    </svg>
  `;

  const darkStar = `
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.53965 0L8.41481 3.62102L12.5783 4.19917L9.55898 7.01383L10.2741 11L6.53965 9.12863L2.80521 11L3.52031 7.01383L0.500977 4.19917L4.68037 3.62102L6.53965 0Z"
        fill="#333333"
      />
    </svg>
  `;

  const activeStar = `
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.53965 0L8.41481 3.62102L12.5783 4.19917L9.55898 7.01383L10.2741 11L6.53965 9.12863L2.80521 11L3.52031 7.01383L0.500977 4.19917L4.68037 3.62102L6.53965 0Z"
        fill="#EBA430"
      />
    </svg>
  `;
  return { greyStar, darkStar, activeStar };
}

export function initialiseCarousel(selector) {
  const carouselContainer = getElement(selector);
  // eslint-disable-next-line no-unused-vars
  const flkty = new Flickity(carouselContainer, {
    cellAlign: 'left',
    cellSelector: '.book-thumbnail',
    contain: true,
    adaptiveHeight: true,
    freeScroll: true,
    percentPosition: false,
    arrowShape: 'M 49.74,100 L 47.7250,6.092 L 4.52,55.0433 L 49.74,100 Z',
  });

  // Hack for horizontal scrolling in Flickity
  wheel.addWheelListener(flkty.element, (event) => {
    const wheelNormalized = normalizeWheel(event);
    const highestValue =
      Math.abs(wheelNormalized.pixelY) >= Math.abs(wheelNormalized.pixelX)
        ? wheelNormalized.pixelY
        : wheelNormalized.pixelX * 0.75;
    flkty.applyForce(-highestValue / 8);
    flkty.startAnimation();
    flkty.dragEnd();
  });
}

function createImageUrl(title) {
  const imageTitle = title.toLowerCase().split(' ').join('-');

  return images[imageTitle];
}

function createListText(list) {
  return list.join(', ');
}

function getStatusColor(status) {
  if (status === 'Available') {
    return 'green';
  }
  return 'red';
}

function createStars(ratings, type) {
  const { greyStar, activeStar, darkStar } = getStars();
  let stars = '';

  for (let i = 0; i < 5; i += 1) {
    if (i < ratings) {
      stars += activeStar;
    } else {
      if (type === 'card') {
        stars += greyStar;
      } else {
        stars += darkStar;
      }
    }
  }

  return stars;
}

export function createBookCards(books, gridSelector) {
  const booksGrid = getElement(gridSelector);

  booksGrid.innerHTML = books
    .map((book) => {
      const {
        status,
        title,
        authors,
        year_published,
        genre,
        engagement: { ratings, users, likes },
      } = book;

      const imageUrl = createImageUrl(title);
      const authorsList = createListText(authors);
      const genreList = createListText(genre);
      const statusColor = getStatusColor(status);

      const stars = createStars(ratings, 'card');

      return `
        <li class="book-card">
          <div class="book-card__image">
            <img src="${imageUrl}" alt="${title}" />
          </div>
          <div class="book-card__content">
            <p class="book-card__status book-card__status--${statusColor}">${status}</p>
            <article class="book-card__details">
              <h4>${title}</h4>
              <p>${authorsList} - ${year_published ? year_published : ''}</p>
              <p>${genreList}</p>
              <div class="book-engagement flex-items-center">
                <div class="book-engagement__ratings">
                  <p>Ratings: ${ratings.toFixed(1)}</p>
                  <div class="book-engagement__stars flex-items-center">
                    ${stars}
                  </div>
                </div>
                <div class="book-engagement__users flex-items-center">
                  <div class="flex-items-center">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.41008 11C8.74665 11 9.0195 10.7324 9.0195 10.4022C9.0195 9.51523 8.75342 8.68925 8.29529 7.99685C8.87764 7.48512 9.64689 7.17392 10.4902 7.17392C12.3078 7.17392 13.7811 8.61926 13.7811 10.4022C13.7811 10.7324 14.054 11 14.3906 11C14.7272 11 15 10.7324 15 10.4022C15 7.95892 12.9809 5.97827 10.4902 5.97827C9.34305 5.97827 8.29589 6.39847 7.5 7.09054C6.70411 6.39847 5.65695 5.97827 4.50975 5.97827C2.01908 5.97827 0 7.95892 0 10.4022C0 10.7324 0.272849 11 0.609426 11C0.946002 11 1.21885 10.7324 1.21885 10.4022C1.21885 8.61926 2.69224 7.17392 4.50975 7.17392C5.35311 7.17392 6.12237 7.48512 6.70471 7.99684C6.24658 8.68924 5.9805 9.51523 5.9805 10.4022C5.9805 10.7324 6.25335 11 6.58992 11C6.9265 11 7.19935 10.7324 7.19935 10.4022C7.19935 9.92026 7.307 9.46299 7.5 9.05227C7.693 9.46299 7.80065 9.92026 7.80065 10.4022C7.80065 10.7324 8.0735 11 8.41008 11ZM4.50975 5.5C2.9615 5.5 1.70639 4.26878 1.70639 2.75C1.70639 1.23122 2.9615 0 4.50975 0C6.058 0 7.31311 1.23122 7.31311 2.75C7.31311 4.26878 6.058 5.5 4.50975 5.5ZM4.50975 4.30435C5.38485 4.30435 6.09426 3.60844 6.09426 2.75C6.09426 1.89156 5.38485 1.19565 4.50975 1.19565C3.63465 1.19565 2.92524 1.89156 2.92524 2.75C2.92524 3.60844 3.63465 4.30435 4.50975 4.30435ZM10.4902 4.30435C11.3653 4.30435 12.0748 3.60844 12.0748 2.75C12.0748 1.89156 11.3653 1.19565 10.4902 1.19565C9.61515 1.19565 8.90574 1.89156 8.90574 2.75C8.90574 3.60844 9.61515 4.30435 10.4902 4.30435ZM10.4902 5.5C8.942 5.5 7.68689 4.26878 7.68689 2.75C7.68689 1.23122 8.942 0 10.4902 0C12.0385 0 13.2936 1.23122 13.2936 2.75C13.2936 4.26878 12.0385 5.5 10.4902 5.5Z"
                        fill="black"
                      />
                    </svg>
                    <p>${users}</p>
                  </div>
                  <div class="flex-items-center">
                    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.99811 9L9.13183 5.04131C9.68733 4.48902 10 3.73577 10 2.94978C10 2.16379 9.68733 1.41054 9.13183 0.85825C7.98818 -0.271677 6.16141 -0.287922 4.99811 0.82149C3.83279 -0.285828 2.00601 -0.266222 0.864401 0.865856C0.309892 1.41916 -0.00141469 2.17299 4.83342e-06 2.95897C0.00142436 3.74496 0.315452 4.49764 0.871956 5.04891L4.99811 9ZM1.57329 1.58205C1.98776 1.16659 2.5651 0.959575 3.14713 1.01773C3.72915 1.07588 4.25482 1.3931 4.58008 1.88247L4.99811 2.51626L5.41614 1.88247C5.48987 1.77408 5.57423 1.67343 5.66797 1.58205C6.43291 0.826396 7.658 0.826396 8.42294 1.58205C8.78603 1.94257 8.99106 2.43415 8.99248 2.94756C8.9939 3.46097 8.79159 3.95369 8.43049 4.31624L4.99811 7.60058L1.57329 4.32005C1.21003 3.95836 1.00562 3.46539 1.00562 2.95105C1.00562 2.4367 1.21003 1.94373 1.57329 1.58205Z"
                        fill="black"
                      />
                    </svg>
                    <p>${likes}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </li>
      `;
    })
    .join('');
}

export function createBookThumbnails(books, selector) {
  const booksContainer = getElement(selector);

  booksContainer.innerHTML = books
    .map((book) => {
      const {
        status,
        title,
        authors,
        year_published,
        genre,
        labels,
        engagement: { ratings, users, likes },
      } = book;

      const imageUrl = createImageUrl(title);
      const authorsList = createListText(authors);
      const genreList = createListText(genre);
      const labelsList = createListText(labels);
      const statusColor = getStatusColor(status);

      const stars = createStars(ratings, 'thumbnail');

      return `     
        <li class="book-thumbnail">
          <div class="book-thumbnail__image">
            <img src="${imageUrl}" alt="${title}" />
          </div>
          <div class="book-thumbnail__content">
            <div>
              <p class="book-thumbnail__status book-thumbnail__status--${statusColor}">${status}</p>
              <article class="book-thumbnail__details">
                <h4>${title}</h4>
                <p class="book-thumbnail__details-authors">
                  ${authorsList}
                  <br/>
                  ${year_published ? year_published : ''}
                </p>
                <p class="book-thumbnail__details-genre desktop-only">
                  <span class="book-thumbnail__details--bold">Genre: </span>
                  ${genreList}
                  <br/>
                  <span class="book-thumbnail__details--bold">Labels: </span>
                  ${labelsList}
                </p>
                <div class="book-engagement thumbnail flex-items-center">
                  <div class="book-engagement__ratings">
                    <p>
                      <span class="book-thumbnail__details--bold">Ratings: </span>
                      ${ratings.toFixed(1)}
                    </p>
                    <div class="book-engagement__stars flex-items-center">
                      ${stars}
                    </div>
                  </div>
                  <div class="book-engagement__users flex-items-center">
                    <div class="flex-items-center">
                      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.41008 11C8.74665 11 9.0195 10.7324 9.0195 10.4022C9.0195 9.51523 8.75342 8.68925 8.29529 7.99685C8.87764 7.48512 9.64689 7.17392 10.4902 7.17392C12.3078 7.17392 13.7811 8.61926 13.7811 10.4022C13.7811 10.7324 14.054 11 14.3906 11C14.7272 11 15 10.7324 15 10.4022C15 7.95892 12.9809 5.97827 10.4902 5.97827C9.34305 5.97827 8.29589 6.39847 7.5 7.09054C6.70411 6.39847 5.65695 5.97827 4.50975 5.97827C2.01908 5.97827 0 7.95892 0 10.4022C0 10.7324 0.272849 11 0.609426 11C0.946002 11 1.21885 10.7324 1.21885 10.4022C1.21885 8.61926 2.69224 7.17392 4.50975 7.17392C5.35311 7.17392 6.12237 7.48512 6.70471 7.99684C6.24658 8.68924 5.9805 9.51523 5.9805 10.4022C5.9805 10.7324 6.25335 11 6.58992 11C6.9265 11 7.19935 10.7324 7.19935 10.4022C7.19935 9.92026 7.307 9.46299 7.5 9.05227C7.693 9.46299 7.80065 9.92026 7.80065 10.4022C7.80065 10.7324 8.0735 11 8.41008 11ZM4.50975 5.5C2.9615 5.5 1.70639 4.26878 1.70639 2.75C1.70639 1.23122 2.9615 0 4.50975 0C6.058 0 7.31311 1.23122 7.31311 2.75C7.31311 4.26878 6.058 5.5 4.50975 5.5ZM4.50975 4.30435C5.38485 4.30435 6.09426 3.60844 6.09426 2.75C6.09426 1.89156 5.38485 1.19565 4.50975 1.19565C3.63465 1.19565 2.92524 1.89156 2.92524 2.75C2.92524 3.60844 3.63465 4.30435 4.50975 4.30435ZM10.4902 4.30435C11.3653 4.30435 12.0748 3.60844 12.0748 2.75C12.0748 1.89156 11.3653 1.19565 10.4902 1.19565C9.61515 1.19565 8.90574 1.89156 8.90574 2.75C8.90574 3.60844 9.61515 4.30435 10.4902 4.30435ZM10.4902 5.5C8.942 5.5 7.68689 4.26878 7.68689 2.75C7.68689 1.23122 8.942 0 10.4902 0C12.0385 0 13.2936 1.23122 13.2936 2.75C13.2936 4.26878 12.0385 5.5 10.4902 5.5Z"
                          fill="#DADADA"
                        />
                      </svg>
                      <p>${users}</p>
                    </div>
                    <div class="flex-items-center">
                      <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M4.99811 9L9.13183 5.04131C9.68733 4.48902 10 3.73577 10 2.94978C10 2.16379 9.68733 1.41054 9.13183 0.85825C7.98818 -0.271677 6.16141 -0.287922 4.99811 0.82149C3.83279 -0.285828 2.00601 -0.266222 0.864401 0.865856C0.309892 1.41916 -0.00141469 2.17299 4.83342e-06 2.95897C0.00142436 3.74496 0.315452 4.49764 0.871956 5.04891L4.99811 9ZM1.57329 1.58205C1.98776 1.16659 2.5651 0.959575 3.14713 1.01773C3.72915 1.07588 4.25482 1.3931 4.58008 1.88247L4.99811 2.51626L5.41614 1.88247C5.48987 1.77408 5.57423 1.67343 5.66797 1.58205C6.43291 0.826396 7.658 0.826396 8.42294 1.58205C8.78603 1.94257 8.99106 2.43415 8.99248 2.94756C8.9939 3.46097 8.79159 3.95369 8.43049 4.31624L4.99811 7.60058L1.57329 4.32005C1.21003 3.95836 1.00562 3.46539 1.00562 2.95105C1.00562 2.4367 1.21003 1.94373 1.57329 1.58205Z"
                          fill="#DADADA"
                        />
                      </svg>
                      <p>${likes}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div class="book-thumbnail__control mobile-only">
            <div>
              <button class="cog flex-center">
                <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 1.5C0 2.32843 0.671573 3 1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5Z" fill="#999999"/>
                  <path d="M0 7.5C0 8.32843 0.671573 9 1.5 9C2.32843 9 3 8.32843 3 7.5C3 6.67157 2.32843 6 1.5 6C0.671573 6 0 6.67157 0 7.5Z" fill="#999999"/>
                  <path d="M1.5 15C0.671573 15 0 14.3284 0 13.5C0 12.6716 0.671573 12 1.5 12C2.32843 12 3 12.6716 3 13.5C3 14.3284 2.32843 15 1.5 15Z" fill="#999999"/>
                </svg>
              </button>
            </div>
            <div class="hide">
              <button class="close">
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.99998 5.54187L1.20836 0.750244L-6.10352e-05 1.95866L4.79156 6.75029L-1.8537e-05 11.5419L1.2084 12.7503L5.99998 7.9587L10.7915 12.7502L11.9999 11.5418L7.2084 6.75029L12 1.9587L10.7916 0.750287L5.99998 5.54187Z" fill="#DDDDDD"/>
                </svg>
              </button>
            </div>
            <button aria-hidden="true"></button>
          </div>
        </li>
      `;
    })
    .join('');
}

// Filtering & AutoComplete Utility Functions
export function generateSearchList(books) {
  const searchList = books.map((book) => ({
    bookString: `${book.title} - ${createListText(book.authors)}`,
    bookDetails: book,
  }));

  return searchList;
}

export function generateBookResult(book, searchParam) {
  const paramIndex = book.toLowerCase().indexOf(searchParam.toLowerCase());
  let bookResult = '';

  // If search paramater is at the beginning of the book string
  if (paramIndex === 0) {
    bookResult += `<strong>${book.substr(paramIndex, searchParam.length)}</strong>`;
    bookResult += book.substr(paramIndex + searchParam.length);

    return bookResult;
  }

  // If search paramater is at the end of the book string
  if (paramIndex === book.length - searchParam.length) {
    bookResult += book.substr(0, paramIndex);
    bookResult += `<strong>${book.substr(paramIndex, searchParam.length)}</strong>`;

    return bookResult;
  }

  // If search parameter is within the book string
  bookResult += book.substr(0, paramIndex);
  bookResult += `<strong>${book.substr(paramIndex, searchParam.length)}</strong>`;
  bookResult += book.substr(paramIndex + searchParam.length);

  return bookResult;
}

// Polyfill Utility functions
export function initialiseStickyElements(selector) {
  // Polyfill for position sticky
  const stickyElements = document.querySelectorAll(selector);
  Stickyfill.add(stickyElements);
}
