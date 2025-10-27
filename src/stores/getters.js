export default {
  getColumnById: (state) => (columnId) => {
    const column = state.columns.find((column) => column.id === columnId)
    return column
      ? {
          ...column,
          tasks: column.taskIds
            .map((taskId) => state.tasks.find((task) => task.id === taskId))
            .filter(Boolean),
        }
      : null
  },

  getTasksByColumn: (state) => (columnId) => {
    const column = state.columns.find((col) => col.id === columnId)
    return column
      ? column.taskIds
          .map((taskId) => state.tasks.find((task) => task.id === taskId))
          .filter(Boolean)
      : []
  },

  getTaskById: (state) => (taskId) => {
    return state.tasks.find((task) => task.id === taskId)
  },

  totalTasks: (state) => {
    return state.tasks?.length || 0
  },

  completedTasks: (state) => {
    const doneColumn = state.columns.find((col) => col.id === 'done')
    return doneColumn ? doneColumn.taskIds.length : 0
  },

  progressPercentage: (state, getters) => {
    if (getters?.totalTasks === 0) return 0
    return Math.round((getters?.completedTasks / getters?.totalTasks) * 100)
  },
}
