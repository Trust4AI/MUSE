import fs from 'fs'

const readJSONFile = (filePath: string) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (error: any) {
        throw new Error(
            `Error reading JSON file at ${filePath}: ${error.message}`
        )
    }
}

const writeOutputToFile = (json: JSON) => {
    const date = new Date().toISOString().replace(/:/g, '-')
    fs.writeFileSync(`./output/${date}.json`, JSON.stringify(json, null, 4))
}

const writeJSONToFile = (filePath: string, data: JSON) => {
    const jsonData: string = JSON.stringify(data, null, 4)
    fs.writeFileSync(filePath, jsonData, 'utf8')
}

export { readJSONFile, writeOutputToFile, writeJSONToFile }
