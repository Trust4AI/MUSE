import { check, body } from 'express-validator'
import { getGeneratorModelsList } from '../../utils/modelUtils'
import {
    getBiasTypes,
    getGenerationMethods,
    getPlaceholderNumber,
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
    check('attribute')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'attribute is optional but if provided must be a string with length between 1 and 30'
        ),
    check('attribute_1')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'attribute_1 is optional but if provided must be a string with length between 1 and 30'
        ),
    check('attribute_2')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'attribute_2 is optional but if provided must be a string with length between 1 and 30'
        ),
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
    body().custom((value, { req }) => {
        const {
            generation_method,
            attribute = '',
            attribute_1 = '',
            attribute_2 = '',
        }: {
            generation_method: string
            attribute: string
            attribute_1: string
            attribute_2: string
        } = req.body

        if (
            (attribute && attribute_1) ||
            (attribute && attribute_2) ||
            (attribute && attribute_1 && attribute_2)
        ) {
            throw new Error(
                'You must provide either "attribute", both "attribute_1" and "attribute_2" or none of them.'
            )
        } else if (attribute || (attribute_1 && attribute_2)) {
            const placeholderNumber: number =
                getPlaceholderNumber(generation_method)

            if (placeholderNumber !== -1) {
                if (placeholderNumber === 1 && attribute_1 && attribute_2) {
                    throw new Error(
                        'The generation_method only uses one attribute, so you must provide only "attribute" and not both "attribute_1" and "attribute_2".'
                    )
                } else if (placeholderNumber === 2 && attribute) {
                    throw new Error(
                        'The generation_method uses two attributes, so you must provide both "attribute_1" and "attribute_2" and not "attribute".'
                    )
                }
            }
        }

        return true
    }),
]

export { generate }
