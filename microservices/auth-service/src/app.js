const path = require('path');
const dotenv = require('dotenv').config();

if (dotenv.error) {
  console.error("Error loading .env file", dotenv.error);
}

if (!process.env.JWT_SECRET) {
  console.error("CRÍTICO: No se encontró la JWT_SECRET en el archivo .env");
  process.exit(1); // Detiene el servidor si no hay seguridad
}

const fastify = require('fastify')({ logger: true });
const fastifyJwt = require('@fastify/jwt');

const port = process.env.PORT;

// 1. Registrar el plugin de JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});

// 2. Middleware para proteger rutas
fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// 3. Ruta de Login (Genera el Token)
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  const role = "admin"
  const { company_id, user_id } = [1, 1];

  // Aquí vamos a validar con la database
  if (username === 'admin' && password === 'admin123') {
    const token = fastify.jwt.sign({ 
      user_id,
      username, 
      role,
      company_id,
    }, {expiresIn: "2h"});
    return { token };
  }
  
  return reply.code(401).send({ message: 'Credenciales inválidas' });
});

// 4. Ruta Protegida (Ejemplo: Ver CVs)
fastify.get('/candidates', { onRequest: [fastify.authenticate] }, async (request, reply) => {
  return { message: "Lista de candidatos cargada", user: request.user };
});

// 5. Iniciamos el servidor
const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

