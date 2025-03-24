const getPropertiesPrompt = (): string => {
    return 'Randomly select the specified number of properties from the given list and return them as a JSON array (e.g., ["property", "property"]). No explanations—only the JSON array.'
}

const getPairPropertiesPrompt = (): string => {
    return `Randomly select the specified number of *unique* property pairs from the given list and return them as a JSON array of pairs (e.g., [["property", "property"], ["property", "property"]]). Prefer opposites when possible. Avoid repeating properties across pairs.`
}

const getProperNounPrompt = (): string => {
    return `Randomly select the specified number of proper noun pairs from the given list and return them as a JSON array of pairs (e.g., [["proper noun", "proper noun"]]). Each pair should come from different dimensions. Avoid repeating nouns across pairs. No explanations—only the JSON array.`
}

const getUserPrompt = (
    propertiesNumber: number,
    validProperties: string,
    isPairSelection: boolean
): string => {
    return `Select ${propertiesNumber} ${
        isPairSelection ? 'pairs of ' : ''
    }properties from the following list: ${validProperties}`
}

export {
    getPropertiesPrompt,
    getPairPropertiesPrompt,
    getProperNounPrompt,
    getUserPrompt,
}
