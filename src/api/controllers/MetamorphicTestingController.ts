import container from '../config/container'
import { Request, Response } from 'express'

class MetamorphicTestingController {
    metamorphicTestingService: any
    constructor() {
        this.metamorphicTestingService = container.resolve(
            'metamorphicTestingService'
        )

        this.check = this.check.bind(this)
        this.generate = this.generate.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.metamorphicTestingService.check()
            res.json(message)
        } catch (err: any) {
            res.status(500).send(err.message)
        }
    }

    generate(req: Request, res: Response) {
        try {
            const { role, type, number, explanation } = req.body
            const generatedData = this.metamorphicTestingService.generate(
                role,
                type,
                number,
                explanation
            )
            res.json(generatedData)
        } catch (err: any) {
            res.status(500).send(err.message)
        }
    }
}

export default MetamorphicTestingController
