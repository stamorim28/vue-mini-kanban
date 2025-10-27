describe('Modal de Voz', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('abre e fecha modal de voz', () => {
    cy.contains('Criar tarefa por voz').click()
    cy.contains('Criar tarefa por voz').should('be.visible') // No modal
    cy.get('.voice-input__modal-close').click()

    // Verifica que o modal sumiu (mas o botão principal ainda existe)
    cy.get('.voice-input__modal').should('not.exist')
    cy.contains('Criar tarefa por voz').should('be.visible') // Botão principal
  })

  it('mostra controles no modal', () => {
    cy.contains('Criar tarefa por voz').click()
    cy.get('.voice-input__record-btn').should('be.visible')
    cy.get('.voice-input__process-btn').should('be.visible')
    cy.get('.voice-input__modal-close').should('be.visible')
  })
})
