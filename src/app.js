const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const authRoutes = require('./routes/auth.routes');
const mesasRoutes = require('./routes/mesas.routes');
const reservacionesRoutes = require('./routes/reservaciones.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservaciones', reservacionesRoutes);

app.get('/', (req, res) => res.json({ mensaje: 'API de reservaciones activa' }));

module.exports = app;