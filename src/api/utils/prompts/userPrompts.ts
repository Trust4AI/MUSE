const getUserPrompt = (number?: number, explanation?: boolean) => {
    return `Generate${number ? ' ' + number : ''} test cases${
        explanation ? ', with explanation' : ''
    }.`
}

export { getUserPrompt }
