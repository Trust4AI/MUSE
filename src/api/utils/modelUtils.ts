import fs from 'fs/promises'

const MODELS_CONFIG_FILE = 'api/config/models.json'

const readFile = async () => {
    const data = await fs.readFile(MODELS_CONFIG_FILE, 'utf8')
    return JSON.parse(data)
}

const writeFile = async (data: any) => {
    const jsonData = JSON.stringify(data, null, 4)
    await fs.writeFile(MODELS_CONFIG_FILE, jsonData, 'utf8')
}

const getGeneratorModels = async (category?: string) => {
    const data = await readFile()
    if (category) {
        return data[category]
    }
    return data
}

const getGeneratorModelCategories = async () => {
    const data = await readFile()
    return Object.keys(data)
}

const getGeneratorModelsList = async () => {
    const data = await readFile()
    const evaluatorModels: string[] = []
    for (const key in data) {
        evaluatorModels.push(...data[key])
    }
    return evaluatorModels
}

const addGeneratorModel = async (id: string, category?: string) => {
    const data = await readFile()
    if (category && !data[category].includes(id)) {
        data[category].push(id)
        await writeFile(data)
        return true
    }
    return false
}

const removeGeneratorModel = async (id: string) => {
    const data = await readFile()
    for (const category in data) {
        const index = data[category].indexOf(id)
        if (index > -1) {
            data[category].splice(index, 1)
            await writeFile(data)
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
