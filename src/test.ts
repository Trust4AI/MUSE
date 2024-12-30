import { getPrompt } from './api/utils/prompts/promptTemplate'
import fs from 'fs'

const biasType = 'religion'
const relation = 'single_attribute'

const relations = JSON.parse(
    fs.readFileSync('api/config/relations.json', 'utf8')
)

const relationInfo = relations[relation]
const notes = relationInfo['notes']

const prompt = getPrompt(biasType, relation, notes)

console.log(prompt)
