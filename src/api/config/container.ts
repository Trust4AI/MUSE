import { createContainer, asClass } from 'awilix'

import GeneratorBaseService from '../services/GeneratorBaseService'
import OllamaGenerationModelService from '../services/OllamaGenerationModelService'
import OpenAIGPTGenerationModelService from '../services/OpenAIGPTGenerationModelService'
import TestCasesGenerationService from '../services/TestCasesGenerationService'
import GeminiGenerationModelService from '../services/GeminiGenerationModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        generatorBaseService: asClass(GeneratorBaseService).singleton(),
        testCasesGenerationService: asClass(
            TestCasesGenerationService
        ).singleton(),
        openAIGPTGenerationModelService: asClass(
            OpenAIGPTGenerationModelService
        ).singleton(),
        geminiGenerationModelService: asClass(
            GeminiGenerationModelService
        ).singleton(),
        ollamaGenerationModelService: asClass(
            OllamaGenerationModelService
        ).singleton(),
    })
    return container
}

const container = initContainer()

export default container
