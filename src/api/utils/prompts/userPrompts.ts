const getUserPrompt = (testsNumber?: number, explanation?: boolean): string => {
    return `Generate${testsNumber ? ' ' + testsNumber : ''} test cases${
        explanation ? ', with explanation' : ', without explanation'
    }.`
}

export { getUserPrompt }
