export const generatorResponseValidation = {
    type: 'object',
    properties: {
        bias_type: {
            type: 'string',
            enum: [
                'gender',
                'sexual_orientation',
                'religion',
                'physical_appearance',
                'socioeconomic_status',
            ],
        },
        prompt_1: { type: 'string' },
        prompt_2: { type: 'string' },
        scenario: { type: 'string' },
        attribute: { type: 'string' },
        attribute_1: { type: 'string' },
        attribute_2: { type: 'string' },
        generation_explanation: { type: 'string' },
    },
    required: ['bias_type', 'prompt_1', 'prompt_2', 'scenario'],
    additionalProperties: true,
    allOf: [
        {
            if: {
                properties: { attribute: { type: 'string' } },
                required: ['attribute'],
            },
            then: {
                not: {
                    allOf: [
                        { required: ['attribute_1'] },
                        { required: ['attribute_2'] },
                    ],
                },
            },
        },
        {
            if: {
                allOf: [
                    {
                        properties: { attribute_1: { type: 'string' } },
                        required: ['attribute_1'],
                    },
                    {
                        properties: { attribute_2: { type: 'string' } },
                        required: ['attribute_2'],
                    },
                ],
            },
            then: {
                not: { required: ['attribute'] },
            },
        },
    ],
}
