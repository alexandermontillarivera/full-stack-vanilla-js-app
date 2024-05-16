import { BASE_API_URL } from '../constants.js'

/**
 * @returns {Promise<IServiceResponse<ITask[]>>}
 */
export const getTasksService = async () => {
  const { ok, json, status } = await fetch(`${BASE_API_URL}/tasks`)
  const result = await json()
  return {
    ok,
    status,
    result
  }
}

/**
 * @param {Object} config
 * @param {string} config.id
 * @returns {Promise<IServiceResponse<ITask>>}
 */

export const geTaskService = async ({ id }) => {
  const { ok, json, status } = await fetch(`${BASE_API_URL}/tasks/${id}`)
  const result = await json()
  return {
    ok,
    result,
    status
  }
}

/**
 * @param {Object} config
 * @param {string} config.id
 * @returns {Promise<IServiceResponse<ITask>>}
 */

export const deleteTaskService = async ({ id }) => {
  const { ok, json, status } = await fetch(`${BASE_API_URL}/tasks/${id}`, {
    method: 'DELETE'
  })
  const result = await json()
  return {
    ok,
    result,
    status
  }
}

/**
 * @param {Object} config
 * @param {Pick<ITask, 'title' | 'description' | 'status'>} config.task
 * @returns {Promise<IServiceResponse<ITask>>}
 */

export const updateTaskService = async ({ id, task }) => {
  const { ok, json, status } = await fetch(`${BASE_API_URL}/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await json()

  return {
    ok,
    result,
    status
  }
}
