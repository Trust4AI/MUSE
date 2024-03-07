import { OllamaModel } from '../interfaces/OllamaModel'

const models: { [name: string]: OllamaModel } = {
    gemma: {
        name: 'gemma:2b',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'development'
                ? 'http://localhost:11434'
                : 'http://gemma:11434',
    },
}

const getGeneratorModelConfig = (key: string) => {
    if (models[key]) {
        return {
            name: models[key].name,
            host: models[key].host,
        }
    } else {
        return null
    }
}

export { getGeneratorModelConfig }
