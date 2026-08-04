const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Reservaciones de Restaurante',
      version: '1.0.0',
      description: 'API REST con JWT, bcrypt, roles y validación de disponibilidad de mesas'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://la-APP-queaunnotengo-pero-configurare.up.railway.app', description: 'Producción' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);