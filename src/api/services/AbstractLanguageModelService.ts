abstract class LanguageModelService {
    abstract generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ): Promise<JSON>
}

export default LanguageModelService
