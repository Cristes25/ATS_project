const fastify = require('fastify');
const cors = require('@fastify/cors');
const sequelize = require('./infrastructure/database/sequelize');

const buildServer = async () => {
    const app = fastify({
        logger: {
            transport: {
                target: 'pino-pretty'
            }
        }
    });

    // CORS and Security Headers
    await app.register(cors, {
        origin: '*', // Customize this for production
    });

    // Ruta de estado
    app.get('/estado', async (request, reply) => {
        return { estado: 'saludable', servicio: 'talent-service' };
    });

    // Rutas de API
    app.register(require('./interfaces/http/candidateRoutes'), { prefix: '/api/v1/talents' });

    // Intentar Conexión de Base de Datos
    try {
        await sequelize.authenticate();
        app.log.info('La conexion a la base de datos PostgreSQL se ha establecido con exito.');
        // En producción, force: false o sync manual. Para desarrollo rápido:
        await sequelize.sync({ force: false });
    } catch (error) {
        console.error('\n--- DETALLE DEL ERROR DE BASE DE DATOS ---');
        console.error(error.message);
        console.error('------------------------------------------\n');
        app.log.error('No se pudo conectar a la base de datos');
    }

    return app;
};

module.exports = buildServer;
