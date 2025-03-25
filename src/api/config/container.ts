import { createContainer, asClass, AwilixContainer } from 'awilix'

import GeneratorBaseService from '../services/GeneratorBaseService'
import OllamaModelService from '../services/OllamaModelService'
import OpenAIModelService from '../services/OpenAIModelService'
import TestCasesGenerationService from '../services/TestCasesGenerationService'
import GeminiModelService from '../services/GeminiModelService'
import ModelBaseService from '../services/ModelBaseService'

function initContainer(): AwilixContainer {
    const container: AwilixContainer = createContainer()

    container.register({
        generatorBaseService: asClass(GeneratorBaseService).singleton(),
        modelBaseService: asClass(ModelBaseService).singleton(),
        testCasesGenerationService: asClass(
            TestCasesGenerationService
        ).singleton(),
        openAIModelService: asClass(OpenAIModelService).singleton(),
        geminiModelService: asClass(GeminiModelService).singleton(),
        ollamaModelService: asClass(OllamaModelService).singleton(),
    })
    return container
}

const container: AwilixContainer = initContainer()

export default container
