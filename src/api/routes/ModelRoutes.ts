import express, { Router } from 'express'
import ModelController from '../controllers/ModelController'
import * as ModelInputValidation from '../controllers/validation/ModelInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'
import container from '../config/container'
import { checkEntityExists } from '../middlewares/EntityMiddleware'
import ModelBaseService from '../services/ModelBaseService'

const router: Router = express.Router()
const modelController: ModelController = new ModelController()
const modelBaseService: ModelBaseService = container.resolve('modelBaseService')

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: The model routes are working properly!
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *       example:
 *         error: Internal Server Error
 *     ValidationError:
 *       type: object
 *       required:
 *         - type
 *         - value
 *         - msg
 *         - path
 *         - location
 *       properties:
 *         type:
 *           description: The type of the error.
 *           type: string
 *           example: "field"
 *         value:
 *           description: The value of the field that caused the error.
 *           type: string
 *           example: ""
 *         msg:
 *           description: The error message.
 *           type: string
 *           example: "prompt_2 must be a string with length between 1 and 2000"
 *         path:
 *           description: The name of the field that caused the error.
 *           type: string
 *           example: "prompt_2"
 *         location:
 *           description: The location of the error.
 *           type: string
 *           example: "body"
 *     GeneratorModel:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the model.
 *           example: "gpt-4-0125-preview"
 *         category:
 *           type: string
 *           description: The category of the model.
 *           enum: [openai, gemini, ollama]
 *           example: "openai"
 *       example:
 *         id: gpt-4-0125-preview
 *         category: openai
 *     GeneratorModelListFormat:
 *       type: object
 *       properties:
 *         openai:
 *           type: array
 *           description: The list of OpenAI models defined in MUSE configuration.
 *           items:
 *             type: string
 *         gemini:
 *           type: array
 *           description: The list of Gemini models defined in MUSE configuration.
 *           items:
 *             type: string
 *         ollama:
 *           type: array
 *           description: The list of Ollama models defined in MUSE configuration.
 *           items:
 *             type: string
 *       example:
 *         openai:
 *           - "gpt-4-0125-preview"
 *           - "gpt-3.5-turbo-0125"
 *         gemini:
 *           - "gemini-1.0-pro"
 *           - "gemini-1.5-flash"
 *           - "gemini-1.5-pro"
 *         ollama:
 *           - "gemma-7b"
 *           - "lamma3-8b"
 */

/**
 * @swagger
 * tags:
 *  name: Models
 */

/**
 * @swagger
 * /models/check:
 *   get:
 *     summary: Check if the model routes are working properly.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/check').get(modelController.check)

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Get the list of the generator models configured in MUSE.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneratorModelListFormat'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add a new generator model to MUSE configuration.
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneratorModel'
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneratorModel'
 *       422:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/')
    .get(modelController.indexGeneratorModels)
    .post(
        ModelInputValidation.addGeneratorModel,
        handleValidation,
        modelController.addGeneratorModel
    )

/**
 * @swagger
 * /models/{id}:
 *   delete:
 *     summary: Remove a generator model from MUSE configuration.
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the model to be removed.
 *         schema:
 *           type: string
 *           example: "mistral-7b"
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
 *       404:
 *         description: Model not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .delete(
        checkEntityExists(modelBaseService, 'id'),
        modelController.removeGeneratorModel
    )

export default router
