abstract class LanguageModelService {
    abstract generateTestCases(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON>
}

export default LanguageModelService
