const getAttributesPrompt = (): string => {
    return 'Randomly select the specified number of attributes from the given list and return them as a JSON array (e.g., ["attribute", "attribute"]). No explanations—only the JSON array.'
}

const getPairAttributesPrompt = (): string => {
    return `Randomly select the specified number of *unique* attribute pairs from the given list and return them as a JSON array of pairs (e.g., [["attribute", "attribute"], ["attribute", "attribute"]]). Prefer opposites when possible. Avoid repeating attributes across pairs.`
}

const getProperNounPrompt = (): string => {
    return `Randomly select the specified number of proper noun pairs from the given list and return them as a JSON array of pairs (e.g., [["proper noun", "proper noun"]]). Each pair should come from different dimensions. Avoid repeating nouns across pairs. No explanations—only the JSON array.`
}

const getUserPrompt = (
    attributesNumber: number,
    validAttributes: string,
    isPairSelection: boolean
): string => {
    return `Select ${attributesNumber} ${
        isPairSelection ? 'pairs of ' : ''
    }attributes from the following list: ${validAttributes}`
}

export {
    getAttributesPrompt,
    getPairAttributesPrompt,
    getProperNounPrompt,
    getUserPrompt,
}
