import { defineStore } from 'pinia'
import actions from './actions'
import getters from './getters'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: [
      {
        id: 'todo',
        title: 'A fazer',
        tasks: [],
      },
      {
        id: 'in-progress',
        title: 'Em desenvolvimento',
        tasks: [],
      },
      {
        id: 'done',
        title: 'Concluído',
        tasks: [],
      },
    ],
    tasks: [],
    darkMode: false,
    isLoading: false,
    error: null,
  }),
  actions,
  getters,
})
