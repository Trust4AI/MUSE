import { check } from 'express-validator'
import { generatorModels } from '../../config/generatorModels'
import { generationMethods } from '../../config/generationMethods'

const generate = [
    check('generator_model')
        .isString()
        .isIn(generatorModels)
        .withMessage(
            `generator_model must be a string with one of the following values: ${generatorModels.join(
                ', '
            )}`
        ),
    check('generation_method')
        .optional()
        .isString()
        .isIn(generationMethods)
        .withMessage(
            `generation_method is optional but must be a string with one of the following values if provided: ${generationMethods.join(
                ', '
            )}`
        ),
    check('role')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'role is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('bias_type')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'bias_type is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('number')
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage(
            'number is optional but must be an integer between 1 and 8 if provided'
        )
        .toInt(),
    check('explanation')
        .optional()
        .isBoolean()
        .withMessage(
            'explanation is optional but must be a boolean if provided'
        )
        .toBoolean(),
]

export { generate }
