import { indexedDB } from '@/composables/useIndexedDB'

export default {
  async initializeStore() {
    try {
      const savedData = await indexedDB.getStoreData()
      if (savedData) {
        this.columns = savedData.columns || this.columns
        this.tasks = savedData.tasks || this.tasks
        this.darkMode = savedData.darkMode || false
      }

      if (this.darkMode) {
        document.body.classList.add('dark-mode')
      }
    } catch (error) {
      console.error('Error initializing store:', error)
    }
  },

  async addTask(taskData) {
    try {
      this.isLoading = true
      this.error = null

      const newTask = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        columnId: taskData.columnId || 'todo',
        createdAt: new Date().toISOString(),
      }

      console.log('➕ Nova task:', newTask)

      this.tasks.push(newTask)

      const column = this.columns.find((col) => col.id === newTask.columnId)
      if (column) {
        column.tasks.push(newTask)
        console.log('📁 Coluna atualizada:', column)
      }

      console.log('💾 Salvando no IndexedDB...')
      console.log('Columns:', this.columns)
      console.log('Tasks:', this.tasks)

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      console.log('✅ Task salva com sucesso!')
      return newTask
    } catch (error) {
      console.error('❌ Erro ao adicionar task:', error)
      this.error = error.message
      throw error
    } finally {
      this.isLoading = false
    }
  },

  async updateTask(taskId, updates) {
    try {
      this.isLoading = true
      this.error = null

      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates }
      }

      if (updates.columnId) {
        this.columns.forEach((column) => {
          column.taskIds = column.taskIds.filter((id) => id !== taskId)
        })

        const newColumn = this.columns.find((col) => col.id === updates.columnId)
        if (newColumn && !newColumn.taskIds.includes(taskId)) {
          newColumn.taskIds.push(taskId)
        }
      }

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      return this.tasks[taskIndex]
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.isLoading = false
    }
  },

  async moveTask(taskId, fromColumnId, toColumnId) {
    try {
      this.error = null

      const fromColumn = this.columns.find((col) => col.id === fromColumnId)
      if (fromColumn) {
        fromColumn.taskIds = fromColumn.taskIds.filter((id) => id !== taskId)
      }

      const toColumn = this.columns.find((col) => col.id === toColumnId)
      if (toColumn && !toColumn.taskIds.includes(taskId)) {
        toColumn.taskIds.push(taskId)
      }

      await this.updateTask(taskId, { columnId: toColumnId })
    } catch (error) {
      this.error = error.message
      throw error
    }
  },

  async deleteTask(taskId) {
    try {
      this.isLoading = true
      this.error = null

      this.tasks = this.tasks.filter((task) => task.id !== taskId)

      this.columns.forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => id !== taskId)
      })

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.isLoading = false
    }
  },

  toggleDarkMode() {
    this.darkMode = !this.darkMode

    if (this.darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }

    indexedDB.saveStoreData({
      columns: this.columns,
      tasks: this.tasks,
      darkMode: this.darkMode,
    })
  },

  setError(error) {
    this.error = error
  },

  clearError() {
    this.error = null
  },
}
