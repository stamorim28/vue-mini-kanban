describe('Aplicação Vue Kanban', () => {
  it('carrega corretamente', () => {
    cy.visit('/')
    cy.contains('Vue Mini Kanban').should('be.visible')
  })

  it('tem as colunas básicas', () => {
    cy.visit('/')
    cy.contains('A fazer').should('be.visible')
    cy.contains('Em desenvolvimento').should('be.visible')
    cy.contains('Concluído').should('be.visible')
  })

  it('tem botão de criar tarefa', () => {
    cy.visit('/')
    cy.contains('Criar tarefa por voz').should('be.visible')
  })
})
