import { createContainer, asClass } from 'awilix'

import MetamorphicTestingService from '../services/MetamorphicTestingService'
import GenerationModelService from '../services/GenerationModelService'
import HttpClient from '../services/HttpClient'
import OllamaGenerationModelService from '../services/OllamaGenerationModelService'
import OpenAIGPTGenerationModelService from '../services/OpenAIGPTGenerationModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        metamorphicTestingService: asClass(
            MetamorphicTestingService
        ).singleton(),
        generationModelService: asClass(GenerationModelService).singleton(),
        httpClient: asClass(HttpClient).singleton(),
        openAIGPTGenerationModel: asClass(
            OpenAIGPTGenerationModelService
        ).singleton(),
        ollamaGenerationModel: asClass(
            OllamaGenerationModelService
        ).singleton(),
    })
    return container
}

const container = initContainer()

export default container
