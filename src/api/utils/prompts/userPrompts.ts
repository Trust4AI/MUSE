const getUserPrompt = (testsNumber?: number, explanation?: boolean): string => {
    return `Generate${testsNumber ? ' ' + testsNumber : ''} tests${
        explanation ? ', with explanation' : ', without explanation'
    }.`
}

export { getUserPrompt }
