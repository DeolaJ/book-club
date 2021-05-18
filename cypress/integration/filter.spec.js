/// <reference types="cypress" />

describe('Home page (Desktop)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('AutoComplete options show as expected', () => {
    cy.log("Results for 'B'");
    cy.get('input#search-input').type('B');
    cy.get('.searchbar__results').find('button').should('have.length', 2);

    cy.get('input#search-input').clear();

    cy.log("Results for 'li'");
    cy.get('input#search-input').type('li');
    cy.get('.searchbar__results').find('button').should('have.length', 3);

    cy.get('input#search-input').clear();

    cy.log("Results for 'the'");
    cy.get('input#search-input').type('the');
    cy.get('.searchbar__results').find('button').should('have.length', 2);
  });

  it('Searching for all results works as expected', () => {
    cy.get('input#search-input').type('Built');

    cy.get('.searchbar__results').should('have.class', 'active');

    cy.get('.searchbar-icon').click();

    cy.get('.filtered-books h2').contains('Built');

    cy.get('.book-thumbnail h4').contains('Built To Last');
  });

  it('Searching for selected result works as expected', () => {
    cy.get('input#search-input').type('B');

    cy.get('.searchbar__results').should('have.class', 'active');

    cy.get('.searchbar__results button').contains('Built').click();

    cy.get('.filtered-books h2').contains('B');

    cy.get('.book-thumbnail h4').contains('Built To Last');
  });
});

describe('Home page (Mobile)', { viewportWidth: 360 }, () => {
  beforeEach(() => {
    cy.visit('/');

    // Show Searchbar on Mobile
    cy.get('.mobile-search-toggle').click();
  });

  it('AutoComplete options show as expected', () => {
    cy.log("Results for 'B'");
    cy.get('input#search-input').type('B');
    cy.get('.searchbar__results').find('button').should('have.length', 2);

    cy.get('input#search-input').clear();

    cy.log("Results for 'li'");
    cy.get('input#search-input').type('li');
    cy.get('.searchbar__results').find('button').should('have.length', 3);

    cy.get('input#search-input').clear();

    cy.log("Results for 'the'");
    cy.get('input#search-input').type('the');
    cy.get('.searchbar__results').find('button').should('have.length', 2);
  });

  it('Searching for all results works as expected', () => {
    cy.get('input#search-input').type('Built');

    cy.get('.searchbar__results').should('have.class', 'active');

    cy.get('.searchbar-icon').click();

    cy.get('.filtered-books h2').contains('Built');

    cy.get('.book-thumbnail h4').contains('Built To Last');
  });

  it('Searching for selected result works as expected', () => {
    cy.get('input#search-input').type('B');

    cy.get('.searchbar__results').should('have.class', 'active');

    cy.get('.searchbar__results button').contains('Built').click();

    cy.get('.filtered-books h2').contains('B');

    cy.get('.book-thumbnail h4').contains('Built To Last');
  });
});
