interface LanguageModelInterface {
    request(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON>
}

export default LanguageModelInterface
