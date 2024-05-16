import http from 'node:http'

/**
 * @param {string} route
 */

/**
 * @type {IRouterElement[]}
 */

const routes = []


/**
 * @type {Function[]}
 */

const middlewares = []

/**
 * @param {string} route
 * @param {string} url
 */

const parseRoute = (route, url) => {
  const params = {}
  const partsUrl = url.split('/')
  const partsRoute = route.split('/')
  const regexString = route.replace(/:[^\s/]+/g, (match) => {
    const index = partsRoute.findIndex((route) => route === match)
    params[match.slice(1)] = partsUrl[index]
    return '([^/]+)'
  })
  const regex = new RegExp(`^${regexString}`)
  return {
    regex,
    params
  }
}

/**
 * @param {string[]} paramsNames
 * @param {string} path
 */

export const createServer = () => {
  const server = http.createServer()

  server.on('request', async (req, res) => {
    const { url, method } = req

    const next = () => {
      return {
        nextFunctionMiddleware: true
      }
    }

    const json = (content) => {
      const contentJSON = JSON.stringify(content)
      res.write(contentJSON)
      return res.end()
    }

    res.json = json
    
    /**
     * @param {number} index
     */


    const runMiddlewares = async (index) => {
      const fn = middlewares[index]

      if(fn) {
        const result = await fn(req, res, next)
        if(result?.nextFunctionMiddleware) {
          return await runMiddlewares(index + 1)
        }
      }

    }

    await runMiddlewares(0)

    if (routes.length === 0) {
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify({
        message: 'Not found'
      }))
      res.end()
      return
    }

    for (let i = 0; i < routes.length; i++) {
      const currentRoute = routes[i]
      const parser = parseRoute(currentRoute.path, url)
      const isMatch = parser.regex.test(url) && currentRoute.method === method
    
      if(isMatch) {
        req.params = parser.params
        const runHandlers = async (index) => {
          const fn = currentRoute.handlers[index]

          if(fn) {
            const result = await fn(req, res, next)
            if(result?.nextFunctionMiddleware) {
              return await runHandlers(index + 1)
            }
          }
        }

        runHandlers(0)

        break
      }

      if(!isMatch && i >= routes.length - 1) {
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify({
          message: 'Not found'
        }))
        res.end()
      }
    }
  })

  const methodsHttp =  {
    get: (path, ...cb) => {
      routes.push({
        handlers: cb,
        method: 'GET',
        path
      })
    },
    put: (path, ...cb) => {
      routes.push({
        handlers: cb,
        method: 'PUT',
        path
      })
    },
    patch: (path, ...cb) => {
      routes.push({
        handlers: cb,
        method: 'PATCH',
        path
      })
    },
    delete: (path, ...cb) => {
      routes.push({
        handlers: cb,
        method: 'DELETE',
        path
      })
    },
    post: (path, ...cb) => {
      routes.push({
        handlers: cb,
        method: 'POST',
        path
      })
    }
  }

  const addMiddleware = (fn) => {
    middlewares.push(fn)
  }

  server.get = methodsHttp.get
  server.post = methodsHttp.post
  server.delete =methodsHttp.delete
  server.patch = methodsHttp.patch
  server.put = methodsHttp.put
  server.addMiddleware = addMiddleware

  return server
}


/**
 * @param {Object} config
 * @param {boolean} config.onlyJsonRequests
 */

export const jsonParserMiddleware = (config = { onlyJsonRequests: true }) => {
  return (req, res, next) => new Promise((resolve) => {
    if(req.method === 'GET') {
      resolve(next())
      return
    }

    const contentType = req.headers['content-type'] || req.headers['Content-Type']


    if(contentType !== 'application/json' && config.onlyJsonRequests) {
      res.statusCode = 400

      return res.json({
        message: 'The content-type must be a application/json'
      })
    }

    let content = ''

    req.on('data', (chuck) => {
      content = chuck.toString()
    })

    req.on('end', () => {
      try {
        req.body = JSON.parse(content)
        resolve(next())
      } catch (error) {
        req.body = {}
      }
    })
  })
}

export const staticFilesMiddleware = () => {

}
