import { Ajv, ValidateFunction } from 'ajv'
import container from '../config/container'
import { generatorResponseValidation } from '../utils/validation/generatorResponseValidation'
import { getGeneratorModels } from '../utils/modelUtils'
import { debugLog } from '../utils/logUtils'

const ajv = new Ajv()

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '5', 10)

class TestCasesGenerationService {
    openAIGPTGenerationModelService: any
    geminiGenerationModelService: any
    ollamaGenerationModelService: any
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
        generationMethod: string,
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        invertPrompts: boolean
    ): Promise<JSON> {
        let attempts = 0
        let content: string | undefined
        let generationError: any
        while (attempts < MAX_RETRIES) {
            try {
                const modelService = await this.getModelService(generatorModel)
                const resolvedModelService = await modelService
                content = await resolvedModelService.generateTestCases(
                    generatorModel,
                    generationMethod,
                    role,
                    biasType,
                    number,
                    explanation
                )

                if (content) {
                    if (
                        number === 1 &&
                        !content.includes('[') &&
                        !content.includes(']') &&
                        content.includes('{') &&
                        content.includes('}')
                    ) {
                        const startIndex = content.indexOf('{')
                        const endIndex = content.lastIndexOf('}')
                        content = content.slice(startIndex, endIndex + 1)
                        content = `[${content}]`
                    }

                    if (content.includes('[') && content.includes(']')) {
                        const startIndex = content.indexOf('[')
                        const endIndex = content.lastIndexOf(']')
                        content = content.slice(startIndex, endIndex + 1)

                        const jsonContent = JSON.parse(content)
                        if (jsonContent.length === number) {
                            await this.validateTestCase(jsonContent)
                            if (invertPrompts) {
                                this.invertPrompts(jsonContent)
                            }
                            return jsonContent
                        }
                        throw new Error(
                            `[MUSE] Expected ${number} test cases but received ${jsonContent.length}`
                        )
                    }
                }
                throw new Error(
                    '[MUSE] The model response does not contain a list of test cases'
                )
            } catch (error: any) {
                debugLog(
                    `Attempt ${attempts + 1} failed. Error: ${error.message}`,
                    'error'
                )
                attempts++
                generationError = error
            }
        }
        debugLog('Error generating test cases', 'error')
        throw new Error(generationError.message)
    }

    private async getModelService(generatorModel: string) {
        const geminiModels = await getGeneratorModels('gemini')
        const openAIModels = await getGeneratorModels('openai')

        if (openAIModels.includes(generatorModel)) {
            return this.openAIGPTGenerationModelService
        } else if (geminiModels.includes(generatorModel)) {
            return this.geminiGenerationModelService
        } else {
            return this.ollamaGenerationModelService
        }
    }

    private async validateTestCase(jsonContent: any): Promise<void> {
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
