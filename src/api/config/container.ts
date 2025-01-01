import { createContainer, asClass, AwilixContainer } from 'awilix'

import GeneratorBaseService from '../services/GeneratorBaseService'
import OllamaGenerationModelService from '../services/OllamaGenerationModelService'
import OpenAIGPTGenerationModelService from '../services/OpenAIGPTGenerationModelService'
import TestCasesGenerationService from '../services/TestCasesGenerationService'
import GeminiGenerationModelService from '../services/GeminiGenerationModelService'
import ModelBaseService from '../services/ModelBaseService'

function initContainer(): AwilixContainer {
    const container: AwilixContainer = createContainer()

    container.register({
        generatorBaseService: asClass(GeneratorBaseService).singleton(),
        modelBaseService: asClass(ModelBaseService).singleton(),
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

const container: AwilixContainer = initContainer()

export default container
