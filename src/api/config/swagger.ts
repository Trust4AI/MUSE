import swaggerjsdoc, { Options } from 'swagger-jsdoc'
import yaml from 'yaml'
import fs from 'fs'
import config from './config'

const port: string = config.port
const swaggerJsDoc = swaggerjsdoc

const swaggerOptions: Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            version: '1.0.0',
            title: 'MUSE: AI-driven Metamorphic Testing Inputs Generator',
            description:
                'MUSE generates test inputs for testing the bias of AI-enabled Search Engines. It leverages the capabilities of Large Language Models (LLMs) to create a wide range of source and follow-up test cases.',
            contact: {
                name: 'Trust4AI Team',
                email: '',
                url: 'https://trust4ai.github.io/trust4ai/',
            },
            license: {
                name: 'GNU General Public License v3.0',
                url: 'https://github.com/Trust4AI/MUSE/blob/main/LICENSE',
            },
        },
        servers: [
            {
                url: `http://trust4ai.us.es:8083/api/v1/`,
            },
        ],
    },
    apis: ['./api/routes/GeneratorRoutes.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const yamlString: string = yaml.stringify(swaggerDocs, {})
fs.writeFileSync('../docs/openapi/spec.yaml', yamlString)

export { swaggerDocs }
