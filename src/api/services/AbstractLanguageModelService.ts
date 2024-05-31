abstract class LanguageModelService {
    abstract generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ): Promise<JSON>
}

export default LanguageModelService
