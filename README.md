# Vue Mini Kanban ([com GPT-5-Nano do node-my-ai-api](https://github.com/stamorim28/node-my-ai-api))

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.22-brightgreen.svg)](https://vuejs.org/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-blue.svg)](https://vitest.dev/)
[![Cypress](https://img.shields.io/badge/E2E-Cypress-green.svg)](https://www.cypress.io/)
[![Pinia](https://img.shields.io/badge/State%20Management-Pinia-orange.svg)](https://pinia.vuejs.org/)

Um aplicativo Kanban em que o usuário pode criar tasks com auxílio gpt-5-nano por comando de voz.

Confira também o [node-my-ai-api](https://github.com/stamorim28/node-my-ai-api), o repositório da API usada no projeto.

## 🚀 Funcionalidades

- **🎯 Interface Kanban Completa** - Três colunas (A fazer, Em desenvolvimento, Concluído)
- **🎤 Criação de Tarefas por Voz** - Integração com APIs de transcrição de voz (Whisper)
- **💾 Persistência Local** - Armazenamento com IndexedDB
- **📱 Design Responsivo** - Interface adaptável para todos os dispositivos
- **🧪 Testes Abrangentes** - Unitários (Vitest) e E2E (Cypress)

## 🛠 Tecnologias

### Core
- **Vue.js 3.5** - Framework principal
- **Pinia** - Gerenciamento de estado
- **Vite** - Build tool e dev server

### Estilização
- **SASS/SCSS** - Pré-processador CSS
- **Metodologia BEM** - Organização de classes CSS
- **Design Responsivo** - Mobile-first approach
- **Heroicons** - Biblioteca de ícones

### Testes
- **Vitest** - Testes unitários e de integração
- **Cypress** - Testes end-to-end

### Funcionalidades Avançadas
- **Web Audio API** - Captura e processamento de áudio
- **IndexedDB** - Persistência de dados local

## ⚙️ Como Executar

### Desenvolvimento

```bash
npm install
npm run dev
```

### Testes Unitários (Vitest)
```bash
npm run test:unit
```

### Testes E2E (Cypress)
```bash
npm run preview
npx cypress run --e2e --spec "cypress/e2e"
```
