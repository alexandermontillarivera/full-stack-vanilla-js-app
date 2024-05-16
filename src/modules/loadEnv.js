import path from 'path'
import fs from 'node:fs'

/**
 * @param {Object} config
 * @param {String} [config.fileName=]
 */

export const config = ({ fileName } = { fileName: null }) => {
  const pathFile = path.join(process.cwd(), fileName ?? '.env')
  const existEnvFile = fs.existsSync(pathFile)

  if (!existEnvFile) {
    return
  }

  const fileContent = fs.readFileSync(pathFile).toString().trim()
  const enviroments = fileContent.split('\n')
  
  for (let env of enviroments) {
    const [ name, content ] = env.split('=')
    process.env[name] = content
  }
}
