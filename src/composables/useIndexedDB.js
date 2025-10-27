import { openDB } from 'idb'

const DB_NAME = 'KanbanDB'
const DB_VERSION = 1
const STORE_NAME = 'kanbanStore'

const prepareDataForStorage = (data) => {
  const cleanData = {
    columns: data.columns
      ? data.columns.map((column) => ({
          id: column.id,
          title: column.title,
          taskIds: Array.isArray(column.taskIds) ? [...column.taskIds] : [],

          tasks: Array.isArray(column.tasks)
            ? column.tasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                columnId: task.columnId,
                createdAt: task.createdAt,
              }))
            : [],
        }))
      : [],
    tasks: data.tasks
      ? data.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          columnId: task.columnId,
          createdAt: task.createdAt,
        }))
      : [],
    darkMode: Boolean(data.darkMode),
  }

  return cleanData
}

export const indexedDB = {
  async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  },

  async saveStoreData(data) {
    try {
      const db = await this.initDB()
      const cleanData = prepareDataForStorage(data)
      await db.put(STORE_NAME, cleanData, 'kanbanData')
      console.log('✅ Dados salvos no IndexedDB:', cleanData)
    } catch (error) {
      console.error('❌ Error saving to IndexedDB:', error)
      throw error
    }
  },

  async getStoreData() {
    try {
      const db = await this.initDB()
      const data = await db.get(STORE_NAME, 'kanbanData')
      console.log('📥 Dados carregados do IndexedDB:', data)
      return data
    } catch (error) {
      console.error('Error reading from IndexedDB:', error)
      return null
    }
  },

  async clearStore() {
    try {
      const db = await this.initDB()
      await db.clear(STORE_NAME)
    } catch (error) {
      console.error('Error clearing IndexedDB:', error)
    }
  },
}
