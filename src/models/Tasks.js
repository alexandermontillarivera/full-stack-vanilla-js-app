import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import { ROOT_DATABASE } from '#constants'

const pathTasksLocal = path.join(ROOT_DATABASE, 'tasks.json')

export class TasksCollection {
  constructor () {
    const existFile = fsSync.existsSync(pathTasksLocal)

    if(!existFile) {
      fsSync.writeFileSync(pathTasksLocal, JSON.stringify([], null, 2))
    }
  }

  /**
   * @returns {Promise<ITask[]>}
   */

  #getData = async () => {
    const data = await fs.readFile(pathTasksLocal)
    const parsedData = JSON.parse(data)
    return parsedData
  }
  
  /**
   * @type {ITask[]}
   * @returns {Promise<void>}
   */
  #setData = async (tasks) => {
    const dataString = JSON.stringify(tasks, null, 2)
    await fs.writeFile(pathTasksLocal, dataString)
  }

  /**
   * @param {Omit<ITask, 'id' | 'updatedAt' | 'createdAt'>} task
   */
  save = async (task) => {
    const id = crypto.randomUUID()
    const date = new Date()
    const currentData = await this.#getData()
    const data = {
      ...task,
      createAt: date,
      updatedAt: null,
      id
    }
    const dataToSave = [
      ...currentData,
      data
    ]

    await this.#setData(dataToSave)
    
    return data
  }

  getAll = async () => {
    const data = await this.#getData()
    return data
  }

  /**
   * @param {string} id
   */
  getById = async (id) => {
    const data = await this.#getData()
    const found = data.find((task) => task.id === id)
    return found ?? null
  }

  /**
     * @param {string} id
   */

  deleteById = async (id) => {
    const data = await this.#getData()
    const found = data.findIndex((task) => task.id === id)

    if(found < 0) {
      return null
    }

    const newData = data.slice(found)
    await this.#setData(newData)
    return data[index]
  }

  /**
   * @param {string} id
   * @param {Partial<Omit<ITask, 'id' | 'updatedAt' | 'createdAt'>>} newData
   */

  updateById = async (id, newData) => {
    const data = await this.#getData()

    const found = data.findIndex((task) => task.id === id)

    if(found < 0) {
      return null
    }

    const currentTask = data[found]

    data[found] = {
      ...currentTask,
      ...newData,
      updatedAt: new Date()
    }
    await this.#setData(data)

    return data[found]
  }
}