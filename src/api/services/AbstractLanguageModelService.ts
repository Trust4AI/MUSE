abstract class LanguageModelService {
    abstract request(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON>
}

export default LanguageModelService
