import { Ajv, ValidateFunction } from 'ajv'
import container from '../config/container'
import { generatorResponseValidation } from '../utils/validation/generatorResponseValidation'
import { getGeneratorModels } from '../utils/modelUtils'
import { debugLog } from '../utils/logUtils'
import OpenAIGPTGenerationModelService from './OpenAIGPTGenerationModelService'
import GeminiGenerationModelService from './GeminiGenerationModelService'
import OllamaGenerationModelService from './OllamaGenerationModelService'

const ajv = new Ajv()

const MAX_RETRIES: number = parseInt(process.env.MAX_RETRIES || '5', 10)

class TestCasesGenerationService {
    openAIGPTGenerationModelService: OpenAIGPTGenerationModelService
    geminiGenerationModelService: GeminiGenerationModelService
    ollamaGenerationModelService: OllamaGenerationModelService
    validate: ValidateFunction
    constructor() {
        this.openAIGPTGenerationModelService = container.resolve(
            'openAIGPTGenerationModelService'
        )
        this.geminiGenerationModelService = container.resolve(
            'geminiGenerationModelService'
        )
        this.ollamaGenerationModelService = container.resolve(
            'ollamaGenerationModelService'
        )
        this.validate = ajv.compile(generatorResponseValidation)
    }

    async generateTestCases(
        generatorModel: string,
        number: number,
        invertPrompts: boolean,
        userPrompt: string,
        systemPrompt: string
    ): Promise<any[]> {
        let attempts: number = 0
        let generationError: any
        while (attempts < MAX_RETRIES) {
            try {
                const content = await this.attemptGeneration(
                    generatorModel,
                    userPrompt,
                    systemPrompt,
                    number
                )
                if (invertPrompts) {
                    this.invertPrompts(content)
                }
                return content
            } catch (error: any) {
                debugLog(
                    `Attempt ${attempts + 1} failed. Error: ${error.message}`,
                    'error'
                )
                generationError = error
                attempts++
            }
        }
        debugLog('Error generating test cases', 'error')
        throw new Error(generationError.message)
    }

    private async attemptGeneration(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        number: number
    ): Promise<any[]> {
        const modelService = this.getModelService(generatorModel)
        const content = await modelService.generateTestCases(
            generatorModel,
            userPrompt,
            systemPrompt
        )

        if (!content) throw new Error('[MUSE] Empty model response')

        const parsedContent = this.parseContent(content, number)
        this.validateTestCase(parsedContent)
        return parsedContent
    }

    private parseContent(content: string, number: number): any[] {
        const jsonContent = this.extractJsonArray(content)

        if (jsonContent.length !== number) {
            throw new Error(
                `[MUSE] Expected ${number} test cases but received ${jsonContent.length}`
            )
        }

        return jsonContent
    }

    private extractJsonArray(content: string): any[] {
        const startIndex = content.indexOf('[')
        const endIndex = content.lastIndexOf(']')
        if (startIndex === -1 || endIndex === -1) {
            throw new Error(
                '[MUSE] The model response does not contain a list of test cases'
            )
        }

        return JSON.parse(content.slice(startIndex, endIndex + 1))
    }

    private getModelService(generatorModel: string) {
        const geminiModels = getGeneratorModels('gemini')
        const openAIModels = getGeneratorModels('openai')

        if (openAIModels.includes(generatorModel)) {
            return this.openAIGPTGenerationModelService
        } else if (geminiModels.includes(generatorModel)) {
            return this.geminiGenerationModelService
        } else {
            return this.ollamaGenerationModelService
        }
    }

    private validateTestCase(jsonContent: any): void {
        for (const testCase of jsonContent) {
            if (!this.validate(testCase)) {
                throw new Error(
                    `[MUSE] Invalid response from model: ${JSON.stringify(
                        this.validate.errors
                    )}`
                )
            }
        }
    }

    private invertPrompts(testCases: any[]): void {
        testCases.forEach((testCase) => {
            ;[testCase.prompt_1, testCase.prompt_2] = [
                testCase.prompt_2,
                testCase.prompt_1,
            ]
            if (testCase.attribute_1 && testCase.attribute_2) {
                ;[testCase.attribute_1, testCase.attribute_2] = [
                    testCase.attribute_2,
                    testCase.attribute_1,
                ]
            }
        })
    }
}

export default TestCasesGenerationService
