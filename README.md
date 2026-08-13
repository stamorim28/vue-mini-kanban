# Vue Mini Kanban ([powered by GPT-5-Nano via node-voice-task-api](https://github.com/stamorim28/node-voice-task-api))

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.22-brightgreen.svg)](https://vuejs.org/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-blue.svg)](https://vitest.dev/)
[![Cypress](https://img.shields.io/badge/E2E-Cypress-green.svg)](https://www.cypress.io/)
[![Pinia](https://img.shields.io/badge/State%20Management-Pinia-orange.svg)](https://pinia.vuejs.org/)

A Kanban app where users create tasks by voice, assisted by GPT-5-nano.

Check out [node-voice-task-api](https://github.com/stamorim28/node-voice-task-api), the API used by this project.

## 🚀 Features

- **🎯 Complete Kanban Interface** - Three columns (To Do, In Progress, Done)
- **🎤 Voice Task Creation** - Integration with speech transcription APIs (Whisper)
- **💾 Local Persistence** - Storage with IndexedDB
- **📱 Responsive Design** - Adaptable interface for all devices
- **🧪 Comprehensive Testing** - Unit (Vitest) and E2E (Cypress)

## 🛠 Tech Stack

### Core
- **Vue.js 3.5** - Main framework
- **Pinia** - State management
- **Vite** - Build tool and dev server

### Styling
- **SASS/SCSS** - CSS pre-processor
- **BEM Methodology** - CSS class organization
- **Responsive Design** - Mobile-first approach
- **Heroicons** - Icon library

### Testing
- **Vitest** - Unit and integration tests
- **Cypress** - End-to-end tests

### Advanced Features
- **Web Audio API** - Audio capture and processing
- **IndexedDB** - Local data persistence

## ⚙️ How to Run

### Development

```bash
npm install
npm run dev
```

### Unit Tests (Vitest)
```bash
npm run test:unit
```

### E2E Tests (Cypress)
```bash
npm run preview
npx cypress run --e2e --spec "cypress/e2e"
```
