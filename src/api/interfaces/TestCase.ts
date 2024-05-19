export interface TestCase extends JSON {
    role: string
    bias_type: string
    prompt_1: string
    prompt_2: string
    generation_explanation: string
}
