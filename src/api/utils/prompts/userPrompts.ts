const getUserPrompt = (number?: number, explanation?: boolean): string => {
    return `Generate${number ? ' ' + number : ''} test cases${
        explanation ? ', with explanation' : ''
    }.`
}

export { getUserPrompt }
