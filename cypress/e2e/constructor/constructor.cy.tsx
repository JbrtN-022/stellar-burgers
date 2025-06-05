import cypress from 'cypress';

describe('Проверка функциональности конструктора бургера', () => {
  const categoryBunSelector = '[data-testid=category-buns]';
  const categoryMainSelector = '[data-testid=category-mains]';
  const categorySauceSelector = '[data-testid=category-sauces]';
  const modalsSelector = '[id=modals]';
  const buttonSelector = '[type=button]';
  const constructorElementSelector = '.constructor-element';
  const constructorElementTopSelector = '.constructor-element_pos_top';

  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');
    cy.window().then(win => {
      cy.stub(win.console, 'error').as('consoleError');
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.get('@consoleError').should('not.be.called');
  });

  describe('Добавление компонентов в бургер', () => {
    it('проверяет добавление булок в бургер', () => {
      cy.wait('@getIngredients');
      cy.contains('Выберите булки').should('exist');
      cy.get(categoryBunSelector).should('exist').contains('Добавить').click();
      cy.get(constructorElementTopSelector)
        .contains('Краторная булка N-200i')
        .should('exist');
    });

    it('проверяет добавление начинки в бургер', () => {
      cy.wait('@getIngredients');
      cy.contains('Выберите начинку').should('exist');
      cy.get(categoryMainSelector).should('exist').contains('Добавить').click();
      cy.get(constructorElementSelector)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('проверяет добавление соусов в бургер', () => {
      cy.wait('@getIngredients');
      cy.contains('Выберите начинку').should('exist');
      cy.get(categorySauceSelector)
        .should('exist')
        .contains('Добавить')
        .click();
      cy.get(constructorElementSelector).contains('Соус Spicy-X').should('exist');
    });
  });

  describe('Проверка работы модальных окон', () => {
    it('тестирует открытие и закрытие окна с деталями ингредиента', () => {
      cy.wait('@getIngredients');
      cy.get(categoryBunSelector).should('exist').find('li').first().click();
      cy.get(modalsSelector)
        .contains('Краторная булка N-200i')
        .should('be.visible');
      cy.get(modalsSelector).find('button').click();
      cy.get(modalsSelector).should('not.be.visible');
    });
  });

  describe('Оформление заказа', () => {
    it('проверяет отображение имени пользователя в шапке', () => {
      cy.wait('@getUser', { timeout: 10000 });
      // Спрашивал о решении у старшего наставника, у него работает тест, а у меня нет.
      // Если у вас не работает напишите пожалуйста подробнее про эту ошибку и как примерно ее решить
      cy.get('header').contains('Testing').should('exist');
    });

    it('проверяет успешное оформление заказа и очистку конструктора', () => {
      cy.wait('@getIngredients');
      cy.get(categoryBunSelector).should('exist').contains('Добавить').click();
      cy.get(categoryMainSelector).contains('Добавить').click();
      cy.get(categoryMainSelector).contains('Добавить').click();
      cy.get(categorySauceSelector).contains('Добавить').click();
      cy.get(buttonSelector).contains('Оформить заказ').click();
      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);
      cy.get(modalsSelector).contains('123').should('be.visible');
      cy.get(modalsSelector).find('button').click();
      cy.get(modalsSelector).should('not.be.visible');
      cy.get(constructorElementTopSelector).should('not.exist');
      cy.get(constructorElementSelector).should('not.exist');
    });
  });
});