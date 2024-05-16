
/**
 * @typedef {Object} ErrorValidatorTask
 * @property {String} message
 * @property {boolean} error
 */

/**
 * @param {(import "http").IncomingMessage} req
 * @returns {Promise<Pick<ITask, 'title' | 'description' | 'status'> |  ErrorValidatorTask>}
 */
export const tasksValidator = async (req) => {
  return await new Promise((resolve, reject) => {
    let content = ''

    req.on('data', (chuck) => {
      content = chuck.toString()
    })
  
    req.on('end', () => {
      try {
        /**
         * @type {ITask}
         */
  
        const { title, description, status } = JSON.parse(content)
  
        if(!title || typeof title !== 'string'){
          return reject({
            message: 'Invalid title',
            error: true
          })
        }
  
        if(!description || typeof description !== 'string') {
          return reject({
            message: 'Invalid description',
            error: true
          })
        }
  
        const acceptStatus = ['pending', 'resolve']
  
        if(!status || typeof description !== 'string' | !acceptStatus.includes(status)) {
          return reject({
            message: 'Invalid status',
            error: true
          })
        }
  
        resolve({
          title,
          description,
          status
        })
  
      } catch (error) {
        return {
          message: 'Invalid content',
          error: true
        }      
      }
    })
  })
}