import { Ajv } from 'ajv'
import container from '../containers/container'
import { generatorResponseValidation } from '../utils/validation/generatorResponseValidation'
import AbstractGenerationModelService from './AbstractGenerationModelService'

const ajv = new Ajv()

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '5', 10)

class GenerationModelService extends AbstractGenerationModelService {
    openAIGPTGenerationModel: any
    ollamaGenerationModel: any
    constructor() {
        super()
        this.openAIGPTGenerationModel = container.resolve(
            'openAIGPTGenerationModel'
        )
        this.ollamaGenerationModel = container.resolve('ollamaGenerationModel')
    }

    async generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ): Promise<JSON> {
        let attempts = 0
        let content: string | undefined
        while (attempts < MAX_RETRIES) {
            try {
                if (
                    generatorModel === 'gpt-4-0125-preview' ||
                    generatorModel === 'gpt-3.5-turbo-0125'
                ) {
                    content =
                        await this.openAIGPTGenerationModel.generateTestCases(
                            role,
                            biasType,
                            number,
                            explanation,
                            generationMethod,
                            generatorModel
                        )
                } else {
                    content =
                        await this.ollamaGenerationModel.generateTestCases(
                            role,
                            biasType,
                            number,
                            explanation,
                            generationMethod,
                            generatorModel
                        )
                }
                if (content?.includes('[') && content?.includes(']')) {
                    const startIndex = content.indexOf('[')
                    const endIndex = content.lastIndexOf(']')
                    content = content.slice(startIndex, endIndex + 1)
                }
                const jsonContent = JSON.parse(content ?? '[]')

                const validate = ajv.compile(generatorResponseValidation)

                if (jsonContent.length > 0) {
                    for (const testCase of jsonContent) {
                        if (!validate(testCase)) {
                            throw new Error(
                                `Invalid response from model: ${JSON.stringify(
                                    validate.errors
                                )}`
                            )
                        }
                    }
                    return jsonContent
                }
            } catch (error) {
                console.warn(
                    `Attempt ${attempts + 1} failed. Retrying...`,
                    error
                )
            }
            attempts++
        }
        console.error('Max retries reached')
        return JSON.parse('[]')
    }
}

export default GenerationModelService
