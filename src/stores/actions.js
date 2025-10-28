import { indexedDB } from '@/composables/useIndexedDB'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
      toast.error('Não foi possível carregar suas tarefas.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
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
        voiceTranscript: taskData.voiceTranscript || '', // Nova propriedade
      }

      console.log('➕ Nova task:', newTask)

      this.tasks.push(newTask)

      const column = this.columns.find((col) => col.id === newTask.columnId)
      if (column) {
        column.tasks.push(newTask)
        console.log('📁 Coluna atualizada:', column.id)
      }

      console.log('💾 Salvando no IndexedDB...')

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      console.log('✅ Task salva com sucesso!')
      toast.success('Tarefa salva com sucesso!', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
      return newTask
    } catch (error) {
      console.error('❌ Erro ao adicionar task:', error)
      toast.error('Não foi possível salvar sua tarefa.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
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

      console.log('✏️ Atualizando task:', { taskId, updates })

      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex === -1) {
        throw new Error('Task not found')
      }

      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates }
      const updatedTask = this.tasks[taskIndex]

      this.columns.forEach((column) => {
        const taskInColumnIndex = column.tasks.findIndex((task) => task.id === taskId)

        if (taskInColumnIndex !== -1) {
          if (updates.columnId && updates.columnId !== column.id) {
            column.tasks.splice(taskInColumnIndex, 1)
            console.log('📤 Removido da coluna:', column.id)
          } else {
            column.tasks[taskInColumnIndex] = { ...column.tasks[taskInColumnIndex], ...updates }
          }
        }
      })

      if (updates.columnId) {
        const newColumn = this.columns.find((col) => col.id === updates.columnId)
        if (newColumn) {
          const taskExists = newColumn.tasks.find((task) => task.id === taskId)
          if (!taskExists) {
            newColumn.tasks.push(updatedTask)
            console.log('📥 Adicionado à nova coluna:', newColumn.id)
          }
        }
      }

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      console.log('✅ Task atualizada e salva com sucesso!')
      toast.success('Tarefa atualizada com sucesso!', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })

      return updatedTask
    } catch (error) {
      console.error('❌ Erro ao atualizar task:', error)
      toast.error('Não foi possível atualizar sua tarefa.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
      this.error = error.message
      throw error
    } finally {
      this.isLoading = false
    }
  },

  async moveTask(taskId, fromColumnId, toColumnId) {
    try {
      this.error = null

      console.log('🔄 Movendo task:', { taskId, fromColumnId, toColumnId })
      console.log('📋 Todas as tasks:', this.tasks)
      console.log('📁 Todas as colunas:', this.columns)

      let task = this.tasks.find((t) => t.id === taskId)

      if (!task) {
        for (const column of this.columns) {
          task = column.tasks.find((t) => t.id === taskId)
          if (task) {
            console.log('🔍 Task encontrada na coluna:', column.id)
            break
          }
        }
      }

      if (!task) {
        console.error('❌ Task não encontrada em nenhum lugar!')
        throw new Error('Task not found')
      }

      console.log('✅ Task encontrada:', task)

      const fromColumn = this.columns.find((col) => col.id === fromColumnId)
      if (fromColumn) {
        fromColumn.tasks = fromColumn.tasks.filter((t) => t.id !== taskId)
        console.log('📤 Removido da coluna:', fromColumn.id)
      }

      const toColumn = this.columns.find((col) => col.id === toColumnId)
      if (toColumn) {
        toColumn.tasks.push({ ...task, columnId: toColumnId })
        console.log('📥 Adicionado à coluna:', toColumn.id)
      }

      const taskIndex = this.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) {
        this.tasks.push({ ...task, columnId: toColumnId })
        console.log('➕ Task adicionada ao array central')
      } else {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], columnId: toColumnId }
      }

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      console.log('✅ Task movida e salva com sucesso!')
      toast.success('Tarefa movida com sucesso!', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
    } catch (error) {
      console.error('❌ Erro ao mover task:', error)
      toast.error('Não foi possível mover sua tarefa.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
      this.error = error.message
      throw error
    }
  },

  async deleteTask(taskId) {
    try {
      this.isLoading = true
      this.error = null

      console.log('🗑️ Deletando task:', taskId)

      this.tasks = this.tasks.filter((task) => task.id !== taskId)

      this.columns.forEach((column) => {
        const initialLength = column.tasks.length
        column.tasks = column.tasks.filter((task) => task.id !== taskId)
        if (initialLength !== column.tasks.length) {
          console.log('📤 Removido da coluna:', column.id)
        }
      })

      await indexedDB.saveStoreData({
        columns: this.columns,
        tasks: this.tasks,
        darkMode: this.darkMode,
      })

      console.log('✅ Task deletada e salva com sucesso!')
      toast.success('Tarefa deletada com sucesso!', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
    } catch (error) {
      console.error('❌ Erro ao deletar task:', error)
      toast.error('Não foi possível deletar sua tarefa.', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
        autoClose: 5000,
        toastStyle: {
          fontSize: '14px',
        },
      })
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
