describe('Kanban Básico', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4173')
  })

  it('carrega a página corretamente', () => {
    cy.contains('Vue Mini Kanban').should('be.visible')
    cy.contains('A fazer').should('be.visible')
    cy.contains('Em desenvolvimento').should('be.visible')
    cy.contains('Concluído').should('be.visible')
  })

  it('mostra botão de criar tarefa por voz', () => {
    cy.contains('Criar tarefa por voz').should('be.visible')
  })

  it('tem toggle de modo escuro', () => {
    cy.get('.dark-mode-toggle').should('be.visible')
  })
})
