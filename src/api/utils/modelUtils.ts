import { readJSONFile, writeJSONToFile } from './fileUtils'

const MODELS_CONFIG_FILE = 'api/config/models.json'

const getGeneratorModels = (category?: string) => {
    const data = readJSONFile(MODELS_CONFIG_FILE)
    if (category) {
        return data[category]
    }
    return data
}

const getGeneratorModelCategories = (): string[] => {
    const data = readJSONFile(MODELS_CONFIG_FILE)
    return Object.keys(data)
}

const getGeneratorModelsList = (): string[] => {
    const data = readJSONFile(MODELS_CONFIG_FILE)
    const evaluatorModels: string[] = []
    for (const key in data) {
        evaluatorModels.push(...data[key])
    }
    return evaluatorModels
}

const addGeneratorModel = (id: string, category?: string): boolean => {
    const data = readJSONFile(MODELS_CONFIG_FILE)
    if (category && !data[category].includes(id)) {
        data[category].push(id)
        writeJSONToFile(MODELS_CONFIG_FILE, data)
        return true
    }
    return false
}

const removeGeneratorModel = (id: string): boolean => {
    const data = readJSONFile(MODELS_CONFIG_FILE)
    for (const category in data) {
        const index = data[category].indexOf(id)
        if (index > -1) {
            data[category].splice(index, 1)
            writeJSONToFile(MODELS_CONFIG_FILE, data)
            return true
        }
    }
    return false
}

export {
    getGeneratorModels,
    getGeneratorModelsList,
    getGeneratorModelCategories,
    addGeneratorModel,
    removeGeneratorModel,
}
