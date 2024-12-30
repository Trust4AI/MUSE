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

const writeJSONToFile = (json: JSON) => {
    const date = new Date().toISOString().replace(/:/g, '-')
    fs.writeFileSync(`./output/${date}.json`, JSON.stringify(json, null, 4))
}

export { readJSONFile, writeJSONToFile }
