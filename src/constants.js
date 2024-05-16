import path from 'path'

export const PROCESS_CURRENT_DIRECTORY = process.cwd()
export const ROOT_PUBLIC = path.join(PROCESS_CURRENT_DIRECTORY, 'public')
export const ROOT_DATABASE = path.join(PROCESS_CURRENT_DIRECTORY, 'database')
export const FILE_TYPES_HEADERS = {
  js: 'text/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}
