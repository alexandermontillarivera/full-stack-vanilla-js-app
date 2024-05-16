/**
 * @typedef {Object} ITask
 * @property {string} id
 * @property {String} title
 * @property {'pending' | 'resolve'} status
 * @property {String} description
 * @property {Date} createdAt
 * @property {Date | null} updatedAt
 */

/**
 * @template T
 * @typedef {Object} IServiceResponse
 * @property {boolean} ok
 * @property {number} status
 * @property {T} result
 */

/**
 * @typedef {Object} IRouterElement
 * @property {string} path
 * @property {any[]} handlers
 * @property {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method
 */

