import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RentEase API',
            version: '1.0.0',
            description: 'A minimal property rental API for NIgeria',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
            {
                url: 'https://rentease-api.onrender.com/api',
                description: 'Production server',
            }
        ],
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                Property: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        address: { type: 'string' },
                        price: { type: 'number' },
                        bedrooms: { type: 'integer' },
                        images: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        status: {
                            type: 'string',
                            enum: [ 'AVAILABLE', 'RENTED' ]
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        landlord: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string' },
                                lastName: { type: 'string' }
                            }
                        }
                    }
                },
                CreatePropertyInput: {
                    type: 'object',
                    required: [ 'title', 'address', 'city', 'state', 'price', 'bedrooms' ],
                    properties: {
                        title: { type: 'string', minLength: 5 },
                        description: { type: 'string' },
                        address: { type: 'string', minLength: 5},
                        city: { type: 'string', minLength: 2 },
                        state: { type: 'string', minLength: 2 },
                        price: { type: 'number', minimum: 1 },
                        bedrooms: { type: 'integer', minimum: 1 },
                        images: {
                            type: 'array',
                            items: { type: 'string', format: 'uri' }
                        },
                        status: {
                            type: 'string',
                            enum: [ 'AVAILABLE', 'RENTED' ]
                        }
                    }
                },
                updatePropertyInput: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        price: { type: 'number' },
                        bedrooms: { type: 'integer' },
                        images: {
                            type: 'array',
                            items: { type: 'string', format: 'uri' }
                        },
                        status: {
                            type: 'string',
                            enum: [ 'AVAILABLE', 'RENTED' ]
                        }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
}

export const specs = swaggerJsdoc(options)