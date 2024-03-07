import { createContainer, asValue, asClass } from 'awilix'

import MetamorphicTestingRepository from '../repositories/MetamorphicTestingRepository'

import ChatGPTService from '../services/ChatGPTService'
import MetamorphicTestingService from '../services/MetamorphicTestingService'
import GeneratorService from '../services/GeneratorService'

function initContainer(generatorModel: string) {
    const container = createContainer()

    const selectedGeneratorService =
        generatorModel.toLowerCase() === 'chatgpt'
            ? ChatGPTService
            : GeneratorService

    container.register({
        metamorphicTestingRepository: asValue(MetamorphicTestingRepository),
        chatGPTService: asClass(ChatGPTService).singleton(),
        generatorService: asClass(selectedGeneratorService).singleton(),
        metamorphicTestingService: asClass(
            MetamorphicTestingService
        ).singleton(),
    })
    return container
}

let container: any = null
if (!container) {
    container = initContainer(process.env.GENERATOR_MODEL || 'ChatGPT')
}

export default container
