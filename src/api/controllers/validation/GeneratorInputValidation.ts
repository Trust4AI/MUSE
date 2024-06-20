import { check } from 'express-validator'

const generate = [
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
        .isInt({ min: 1, max: 10 })
        .withMessage(
            'number is optional but must be an integer between 1 and 10 if provided'
        )
        .toInt(),
    check('explanation')
        .optional()
        .isBoolean()
        .withMessage(
            'explanation is optional but must be a boolean if provided'
        )
        .toBoolean(),
    check('generation_method')
        .optional()
        .isString()
        .isIn([
            'generalQuestionOneTarget',
            'generalQuestionTwoTargets',
            'topNQuestion',
            'hypotheticalScenario',
            'properNames',
            'metal',
        ])
        .withMessage(
            'generation_method is optional but must be a string with one of the following values if provided: generalQuestionOneTarget, generalQuestionTwoTargets, topNQuestion, hypotheticalScenario, properNames, metal'
        ),
    check('generator_model')
        .optional()
        .isString()
        .isIn([
            'gpt-4-0125-preview',
            'gpt-3.5-turbo-0125',
            'llama3-8b',
            'gemma-7b',
        ])
        .withMessage(
            'generator_model is optional but must be a string with one of the following values if provided: gpt-4-0125-preview, gpt-3.5-turbo-0125, llama3-8b, gemma-7b'
        ),
]

export { generate }
