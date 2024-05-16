import path from 'node:path'
import fs from 'node:fs/promises'
import http from 'node:http'
import { createServer, jsonParserMiddleware } from '#server'
import { FILE_TYPES_HEADERS, ROOT_PUBLIC } from '#constants'
import { enviroments } from '#config/enviroments.js'
import { tasksValidator } from './validators.js'
import { TasksCollection } from '#models/Tasks.js'

const server = http.createServer()
const customExpress = createServer()

server.on('request', async (req, res) => {
  const Tasks = new TasksCollection()
  const { url, method } = req

  if (method !== 'GET' && req.headers['content-type'] !== FILE_TYPES_HEADERS.json) {
    res.statusCode = 409
    res.setHeader('Content-Type', FILE_TYPES_HEADERS.json)
    res.write(
      JSON.stringify({
        message: 'The content-type must be a application/json'
      })
    )
    res.end()
    return
  }


  if(url.startsWith('/api')){
    res.setHeader('Content-Type', FILE_TYPES_HEADERS.json)
  }

  if(url === '/') {
    res.setHeader('Content-Type', FILE_TYPES_HEADERS.html)
    const htmlContent = await fs.readFile(path.join(ROOT_PUBLIC, 'index.html'))
    res.write(htmlContent)
    res.end()
    return
  }

  if(url.startsWith('/public/') && !url.endsWith('/')) {
    const ext = path.extname(url).replace('.', '')
    const pathContent = path.join(ROOT_PUBLIC, url.split('/public/')[1])
    try {
      const fileContent = await fs.readFile(pathContent)
      res.setHeader('Content-Type', FILE_TYPES_HEADERS[ext])
      res.write(fileContent)
    } catch (error) {
      res.statusCode = 404
      res.setHeader('Content-Type', FILE_TYPES_HEADERS.json)
      res.write(
        JSON.stringify({
          message: 'Not found'
        })
      )
    }
    res.end()
    return
  }

  if(url === '/api/tasks' && method === 'GET') {
    const data = await Tasks.getAll()
    res.write(JSON.stringify(data))
    res.end()
    return
  }
  
  if(url === '/api/tasks' && method === 'POST') {
    try {
      const result = await tasksValidator(req)
      const newTask = await Tasks.newTask(result)
      res.statusCode = 201
      res.write(JSON.stringify(newTask))
    } catch (error) {
      const messageError = JSON.stringify(error)
      res.statusCode = 400
      res.write(messageError)
    }
    res.end()
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', FILE_TYPES_HEADERS.json)
  res.write(
    JSON.stringify({
      message: 'Not found route'
    })
  )

  res.end()
})

server.listen(enviroments.PORT, () => {
  console.log(`[APP]: listening in http://localhost:${enviroments.PORT}`)
})

customExpress.addMiddleware(jsonParserMiddleware())
// /x/idrecurso/algo
customExpress.post('/x/:id/:x', (req, res, next) => {
  return next()
}, async (req, res) => {
  console.log(req.body)
  res.write('Hola')
  res.end()
})


customExpress.listen(4000, () => {
  console.log(`[CUSTOM SERVER]: listening in http://localhost:4000`)
})


