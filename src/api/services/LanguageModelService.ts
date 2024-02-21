import LanguageModelInterface from '../interfaces/LanguageModelInterface'

abstract class LanguageModelService implements LanguageModelInterface {
    abstract request(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON>
}

export default LanguageModelService
