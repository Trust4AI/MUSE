import './config/loadEnv'

const port = process.env.PORT ?? 8000

const app = require('./app')

app.listen(port, () => {
    console.info(`App listening on port ${port}`)
})
