import { createContainer, asClass } from 'awilix'

import ChatGPTService from '../services/ChatGPTService'
import MetamorphicTestingService from '../services/MetamorphicTestingService'

function initContainer() {
    const container = createContainer()

    container.register({
        chatGPTService: asClass(ChatGPTService).singleton(),
        metamorphicTestingService: asClass(
            MetamorphicTestingService
        ).singleton(),
    })
    return container
}

const container = initContainer()

export default container
