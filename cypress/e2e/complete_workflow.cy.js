describe('Workflow Completo Simplificado', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('fluxo básico da aplicação', () => {
    // Apenas verifica que os elementos existem
    cy.contains('Vue Mini Kanban').should('be.visible')
    cy.get('.kanban-column').should('have.length', 3)
    cy.contains('A fazer').should('be.visible')
    cy.contains('Em desenvolvimento').should('be.visible')
    cy.contains('Concluído').should('be.visible')
    cy.contains('Criar tarefa por voz').should('be.visible')
    cy.get('.dark-mode-toggle').should('be.visible')
  })

  it('interage com o modal de voz', () => {
    cy.contains('Criar tarefa por voz').click({ force: true })
    cy.get('.voice-input__modal').should('be.visible')
    cy.get('.voice-input__modal-close').click({ force: true })
    cy.get('.voice-input__modal').should('not.exist')
  })
})
