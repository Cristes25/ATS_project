require('dotenv').config();
const { sequelize } = require('./models');

const fastify = require('fastify')({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// PLUGINS
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
});

fastify.register(require('./plugins/authDecorator'));

// RUTAS
fastify.register(require('./routes/jobRoutes'));

const args = process.argv.slice(2);

const start = async () => {
  try {
    if (args.includes('--alter')) {
      await sequelize.sync({ alter: true });
      console.log('Base de datos actualizada.');
    }

    await sequelize.authenticate();
    console.log('Conexión a la DB establecida correctamente.');

    const port = process.env.PORT || 3003;
    await fastify.listen({ port });

    console.log(`Job Service activo en el puerto ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
