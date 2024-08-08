import { check } from 'express-validator'
import {
    getGeneratorModelCategories,
    getGeneratorModelsList,
} from '../../utils/modelUtils'

const addGeneratorModel = [
    check('id')
        .isString()
        .trim()
        .custom(async (value) => {
            const generatorModels = await getGeneratorModelsList()
            if (generatorModels.includes(value)) {
                return Promise.reject(
                    new Error(
                        `id must be unique and not one of the following values: [${generatorModels.join(
                            `, `
                        )}]. Please use a different id.`
                    )
                )
            }
        })
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'id must be a string with length greater than 1 and less than 30'
        ),
    check('category')
        .optional()
        .isString()
        .trim()
        .custom(async (value) => {
            const generatorModelCategories = await getGeneratorModelCategories()
            if (!generatorModelCategories.includes(value)) {
                return Promise.reject(
                    new Error(
                        `category must be a string, if provided, with one of the following values: [${generatorModelCategories.join(
                            `, `
                        )}]`
                    )
                )
            }
        }),
]

export { addGeneratorModel }
