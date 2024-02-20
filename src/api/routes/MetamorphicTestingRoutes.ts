import express from 'express'
import MetamorphicTestingController from '../controllers/MetamorphicTestingController'
import * as GeneratorInputValidation from '../controllers/validation/GeneratorInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'

const router = express.Router()
const metamorphicTestingController = new MetamorphicTestingController()

router.route('/check').get(metamorphicTestingController.check)
router
    .route('/generate')
    .post(
        GeneratorInputValidation.generate,
        handleValidation,
        metamorphicTestingController.generate
    )

export default router
