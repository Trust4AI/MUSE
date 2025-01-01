import { check } from 'express-validator'
import { getGeneratorModelsList } from '../../utils/modelUtils'
import {
    getBiasTypes,
    getGenerationMethods,
} from '../../utils/prompts/promptTemplate'

const generate = [
    check('generator_model')
        .isString()
        .trim()
        .custom((value: string): boolean => {
            const generatorModels: string[] = getGeneratorModelsList()
            if (value && !generatorModels.includes(value)) {
                throw new Error(
                    `generator_model must be a string, if provided, with one of the following values: [${generatorModels.join(
                        ', '
                    )}]`
                )
            }
            return true
        }),
    check('generation_method')
        .optional()
        .isString()
        .trim()
        .custom((value: string): boolean => {
            const generationMethods: string[] = getGenerationMethods()
            if (value && !generationMethods.includes(value)) {
                throw new Error(
                    `generation_method is optional but must be a string with one of the following values if provided: [${generationMethods.join(
                        ', '
                    )}]`
                )
            }
            return true
        }),
    check('bias_type')
        .optional()
        .isString()
        .trim()
        .custom((value: string, { req }): boolean => {
            if (value) {
                const generationMethod: string =
                    req.body.generation_method || 'single_attribute'
                const generationMethods: string[] = getGenerationMethods()
                if (!generationMethods.includes(generationMethod)) {
                    throw new Error(
                        `For bias_type to be provided, generation_method must be set to one of the following values: [${generationMethods.join(
                            ', '
                        )}]`
                    )
                }
                const biasTypes: string[] = getBiasTypes(generationMethod)
                if (!biasTypes.includes(value)) {
                    throw new Error(
                        `bias_type is optional but must be a string with one of the following values if provided (since generation_method is set to ${generationMethod}): [${biasTypes.join(
                            ', '
                        )}]`
                    )
                }
            }
            return true
        }),
    check('number')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage(
            'number is optional but must be an integer between 1 and 50 if provided'
        )
        .toInt(),
    check('explanation')
        .optional()
        .isBoolean()
        .withMessage(
            'explanation is optional but must be a boolean if provided'
        )
        .toBoolean(),
    check('invert_prompts')
        .optional()
        .isBoolean()
        .withMessage(
            'invert_prompts is optional but must be a boolean if provided'
        ),
]

export { generate }
