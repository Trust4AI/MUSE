import {
    getGeneratorModels,
    getGeneratorModelsList,
    addGeneratorModel,
    removeGeneratorModel,
} from '../utils/modelUtils'

class ModelBaseService {
    check() {
        return { message: 'The model routes are working properly!' }
    }

    async exists(id: string) {
        const generatorModels = await getGeneratorModelsList()
        return generatorModels.includes(id)
    }

    async indexGeneratorModels() {
        return await getGeneratorModels()
    }

    async addGeneratorModel(id: string, category: string) {
        await addGeneratorModel(id, category)
        const res: { id: string; category?: string } = { id }
        if (category) {
            res.category = category
        }
        return res
    }

    async removeGeneratorModel(id: string) {
        const removed = await removeGeneratorModel(id)
        return removed
    }
}

export default ModelBaseService
