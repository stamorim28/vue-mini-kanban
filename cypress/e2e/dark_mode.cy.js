describe('Modo Escuro', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('alterna modo escuro', () => {
    // Começa no modo claro
    cy.get('body').should('not.have.class', 'dark-mode')

    // Clica no toggle com force para evitar problema do toast
    cy.get('.dark-mode-toggle').click({ force: true })

    // Verifica modo escuro
    cy.get('body').should('have.class', 'dark-mode')

    // Volta para modo claro
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('body').should('not.have.class', 'dark-mode')
  })
})
