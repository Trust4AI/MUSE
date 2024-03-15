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
    check('biasType')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'biasType is optional but must be a string with length between 1 and 30 if provided'
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
]

export { generate }
