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
        explanation: boolean
    ): Promise<JSON> {
        let attempts = 0
        let content: string | undefined
        let generationError: any
        while (attempts < MAX_RETRIES) {
            try {
                const modelService = this.getModelService(generatorModel)
                const resolvedModelService = await modelService
                content = await resolvedModelService.generateTestCases(
                    generatorModel,
                    generationMethod,
                    role,
                    biasType,
                    number,
                    explanation
                )

                if (content && content.includes('[') && content.includes(']')) {
                    const startIndex = content.indexOf('[')
                    const endIndex = content.lastIndexOf(']')
                    content = content.slice(startIndex, endIndex + 1)

                    const jsonContent = JSON.parse(content)
                    if (jsonContent.length === number) {
                        await this.validateTestCase(jsonContent)
                        return jsonContent
                    }
                    throw new Error(
                        `[GENERATOR] Expected ${number} test cases but received ${jsonContent.length}`
                    )
                }
                throw new Error(
                    '[GENERATOR] The model response does not contain a list of test cases'
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
                    `[GENERATOR] Invalid response from model: ${JSON.stringify(
                        this.validate.errors
                    )}`
                )
            }
        }
    }
}

export default TestCasesGenerationService
