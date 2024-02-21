import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import metamorphicTesting from './routes/MetamorphicTestingRoutes'
import './utils/config/loadEnv'

const app: Express = express()
const API_VERSION = '/api/v1'

app.use(express.json())
app.use(cors())

app.get(API_VERSION, (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use(API_VERSION + '/metamorphicTesting', metamorphicTesting)

module.exports = app
