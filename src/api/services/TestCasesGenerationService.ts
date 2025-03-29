import { Ajv, ValidateFunction } from 'ajv'
import container from '../config/container'
import { generatorResponseValidation } from '../utils/validation/generatorResponseValidation'
import { propertiesSelectionValidation } from '../utils/validation/propertiesSelectionValidation'
import { getGeneratorModels } from '../utils/modelUtils'
import { debugLog } from '../utils/logUtils'
import OpenAIGPTModelService from './OpenAIModelService'
import GeminiModelService from './GeminiModelService'
import OllamaModelService from './OllamaModelService'
import config from '../config/config'

const ajv = new Ajv()

const MAX_RETRIES: number = parseInt(config.maxRetries, 10)
const RETRY_DELAY: number = 10000 // milliseconds

class TestCasesGenerationService {
    openAIModelService: OpenAIGPTModelService
    geminiModelService: GeminiModelService
    ollamaModelService: OllamaModelService
    generationValidation: ValidateFunction
    constructor() {
        this.openAIModelService = container.resolve('openAIModelService')
        this.geminiModelService = container.resolve('geminiModelService')
        this.ollamaModelService = container.resolve('ollamaModelService')
        this.generationValidation = ajv.compile(generatorResponseValidation)
    }

    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        testsNumber: number,
        invertPrompts: boolean,
        generatorTemperature: number
    ): Promise<any[]> {
        let attempts: number = 0
        let generationError: any
        while (attempts < MAX_RETRIES) {
            try {
                const content = await this.attemptGeneration(
                    generatorModel,
                    userPrompt,
                    systemPrompt,
                    testsNumber,
                    generatorTemperature
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
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
            }
        }
        debugLog('Error generating test cases', 'error')
        throw new Error(generationError.message)
    }

    async selectProperties(
        model: string,
        userPrompt: string,
        systemPrompt: string,
        propertiesNumber: number,
        isPairSelection: boolean
    ): Promise<any[]> {
        const modelService = this.getModelService(model)
        let attempts = 0
        let lastError: any

        while (attempts < MAX_RETRIES) {
            try {
                const content = await modelService.sendRequest(
                    model,
                    userPrompt,
                    systemPrompt,
                    1
                )

                if (!content) throw new Error('[MUSE] Empty model response')

                const jsonContent = this.extractJsonArray(content)

                this.validateSelection(
                    jsonContent,
                    propertiesNumber,
                    isPairSelection
                )

                return jsonContent
            } catch (error: any) {
                debugLog(
                    `selectProperties attempt ${attempts + 1} failed. Error: ${
                        error.message
                    }`,
                    'error'
                )
                lastError = error
                attempts++
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
            }
        }
        debugLog('Error selecting properties', 'error')
        throw new Error(lastError.message)
    }

    private async attemptGeneration(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        number: number,
        generatorTemperature: number
    ): Promise<any[]> {
        const modelService = this.getModelService(generatorModel)
        const content = await modelService.sendRequest(
            generatorModel,
            userPrompt,
            systemPrompt,
            generatorTemperature
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
                `[MUSE] Expected ${number} items but received ${jsonContent.length}`
            )
        }

        return jsonContent
    }

    private extractJsonArray(content: string): any[] {
        const startIndex = content.indexOf('[')
        const endIndex = content.lastIndexOf(']')
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('[MUSE] The model response does not contain a list')
        }

        return JSON.parse(content.slice(startIndex, endIndex + 1))
    }

    private getModelService(generatorModel: string) {
        const geminiModels: string[] = getGeneratorModels('gemini')
        const openAIModels: string[] = getGeneratorModels('openai')

        if (openAIModels.includes(generatorModel)) {
            return this.openAIModelService
        } else if (geminiModels.includes(generatorModel)) {
            return this.geminiModelService
        } else {
            return this.ollamaModelService
        }
    }

    private validateTestCase(jsonContent: any): void {
        for (const testCase of jsonContent) {
            if (!this.generationValidation(testCase)) {
                throw new Error(
                    `[MUSE] Invalid response from model: ${JSON.stringify(
                        this.generationValidation.errors
                    )}`
                )
            }
        }
    }

    validateSelection(
        jsonContent: any,
        expectedLength: number,
        itemsAreTupleOfStrings: boolean
    ): void {
        const schema = propertiesSelectionValidation(
            expectedLength,
            itemsAreTupleOfStrings
        )
        const validate = ajv.compile(schema)

        const isValid = validate(jsonContent)
        if (!isValid) {
            throw new Error(
                `[MUSE] Invalid properties selection: ${JSON.stringify(
                    validate.errors
                )}`
            )
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
