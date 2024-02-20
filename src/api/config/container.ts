import { createContainer, asValue, asClass } from 'awilix'

import MetamorphicTestingRepository from '../repositories/MetamorphicTestingRepository'
import MetamorphicTestingService from '../services/MetamorphicTestingService'

function initContainer() {
  const container = createContainer()

  container.register({
    metamorphicTestingRepository: asValue(MetamorphicTestingRepository),
    metamorphicTestingService: asClass(MetamorphicTestingService).singleton(),
  })
  return container
}

const container = initContainer()

export default container
