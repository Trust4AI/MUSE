import container from '../config/container'
import { GenerateRequestDTO } from '../utils/objects/GenerateRequestDTO'
import {
    getBiasValues,
    getPlaceholderNumber,
    getSystemPrompt,
} from '../utils/prompts/promptTemplate'
import {
    getPairPropertiesPrompt,
    getProperNounPrompt,
    getPropertiesPrompt,
    getUserPrompt as getSelectionUserPrompt,
} from '../utils/prompts/propertiesSelection'
import { getUserPrompt as getGenerationUserPrompt } from '../utils/prompts/userPrompts'
import TestCasesGenerationService from './TestCasesGenerationService'
//import { writeOutputToFile } from '../utils/fileUtils'

const BATCH_SIZE: number = 6

class GeneratorBaseService {
    testCasesGenerationService: TestCasesGenerationService
    constructor() {
        this.testCasesGenerationService = container.resolve(
            'testCasesGenerationService'
        )
    }

    check() {
        return { message: 'The generator routes are working properly!' }
    }

    async generate(dto: GenerateRequestDTO) {
        const {
            generatorModel,
            generationMethod,
            biasType,
            attribute,
            attribute1,
            attribute2,
            testsNumber,
            propertiesNumber,
            testsPerProperty,
            explanation,
            invertPrompts,
            generatorTemperature,
        } = dto

        const generateBatch = async (
            systemPrompt: string,
            batchSize: number
        ) => {
            const userPrompt = getGenerationUserPrompt(batchSize, explanation)
            return this.testCasesGenerationService.generateTestCases(
                generatorModel,
                userPrompt,
                systemPrompt,
                batchSize,
                invertPrompts,
                generatorTemperature
            )
        }

        if (!propertiesNumber && !testsPerProperty) {
            const systemPrompt = getSystemPrompt(
                biasType,
                generationMethod,
                attribute,
                attribute1,
                attribute2
            )

            let remaining = testsNumber
            const response = []

            while (remaining > 0) {
                const batchSize = Math.min(BATCH_SIZE, remaining)
                const batch = await generateBatch(systemPrompt, batchSize)
                response.push(...batch)
                remaining -= batchSize
            }

            return response
        }

        const attributesQuantity = getPlaceholderNumber(generationMethod)
        const isNounBased = generationMethod.includes('nouns')

        const selectionSystemPrompt = isNounBased
            ? getProperNounPrompt()
            : attributesQuantity === 1
            ? getPropertiesPrompt()
            : getPairPropertiesPrompt()

        const propertiesList = getBiasValues(biasType, isNounBased, true)

        const selectionUserPrompt = getSelectionUserPrompt(
            propertiesNumber,
            propertiesList,
            attributesQuantity === 2
        )

        const selectedProperties =
            await this.testCasesGenerationService.selectProperties(
                generatorModel,
                selectionUserPrompt,
                selectionSystemPrompt,
                propertiesNumber,
                attributesQuantity === 2
            )

        const response = []

        for (const property of selectedProperties) {
            const [attr, attr1, attr2] =
                typeof property === 'string'
                    ? [property, '', '']
                    : ['', property[0], property[1]]

            const systemPrompt = getSystemPrompt(
                biasType,
                generationMethod,
                attr,
                attr1,
                attr2
            )

            let remaining = testsPerProperty
            while (remaining > 0) {
                const batchSize = Math.min(BATCH_SIZE, remaining)
                const batch = await generateBatch(systemPrompt, batchSize)
                response.push(...batch)
                remaining -= batchSize
            }
        }

        return response
    }
}

export default GeneratorBaseService
