import container from '../config/container'
import { GenerateRequestDTO } from '../utils/objects/GenerateRequestDTO'
import {
    getBiasValues,
    getPlaceholderNumber,
    getSystemPrompt,
} from '../utils/prompts/promptTemplate'
import {
    getPairAttributesPrompt,
    getProperNounPrompt,
    getAttributesPrompt,
    getUserPrompt as getSelectionUserPrompt,
} from '../utils/prompts/attributesSelection'
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
            attributesNumber,
            testsPerAttribute,
            explanation,
            invertPrompts,
            generationFeedback,
            scenarios,
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

        if (!attributesNumber && !testsPerAttribute) {
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
            ? getAttributesPrompt()
            : getPairAttributesPrompt()

        const attributesList = getBiasValues(biasType, isNounBased, true)

        const selectionUserPrompt = getSelectionUserPrompt(
            attributesNumber,
            attributesList,
            attributesQuantity === 2
        )

        const selectedAttributes =
            await this.testCasesGenerationService.selectAttributes(
                generatorModel,
                selectionUserPrompt,
                selectionSystemPrompt,
                attributesNumber,
                attributesQuantity === 2
            )

        const response = []
        let insertedScenarios: string[] = scenarios

        for (const attribute of selectedAttributes) {
            const [attr, attr1, attr2] =
                typeof attribute === 'string'
                    ? [attribute, '', '']
                    : ['', attribute[0], attribute[1]]

            const baseSystemPrompt: string = getSystemPrompt(
                biasType,
                generationMethod,
                attr,
                attr1,
                attr2
            )

            let remaining = testsPerAttribute
            while (remaining > 0) {
                const batchSize = Math.min(BATCH_SIZE, remaining)

                const shouldAvoidScenarios =
                    insertedScenarios.length > 0 && generationFeedback

                const prompt = shouldAvoidScenarios
                    ? `${baseSystemPrompt}\n\n**Do not in any case generate tests that are similar to the following scenarios:**\n\n${insertedScenarios.join(
                          '; '
                      )}`
                    : baseSystemPrompt

                const batch = await generateBatch(prompt, batchSize)

                response.push(...batch)
                insertedScenarios = [
                    ...insertedScenarios,
                    ...this.getScenarios(batch),
                ]
                remaining -= batchSize
            }
        }

        return response
    }

    private getScenarios(tests: any[]): string[] {
        return tests.map((test) => test.scenario)
    }
}

export default GeneratorBaseService
