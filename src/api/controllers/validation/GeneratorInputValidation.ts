import { check } from 'express-validator'

const generate = [
    check('role')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'Role is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('type')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'Type is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('number')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage(
            'Number is optional but must be an integer between 1 and 10 if provided'
        )
        .toInt(),
    check('explanation')
        .optional()
        .isBoolean()
        .withMessage(
            'Explanation is optional but must be a boolean if provided'
        ),
]

export { generate }
