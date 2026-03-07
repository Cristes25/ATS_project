const path = require('path');
const dotenv = require('dotenv').config();
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

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

// Database Connection
const conn = new Sequelize(process.env.AUTH_DB_NAME, process.env.AUTH_DB_UNAME, process.env.AUTH_DB_PASSWORD, {
    host: process.env.AUTH_DB_HOST,
    dialect: 'postgres',
    logging: console.log,
});



const Tenant = conn.define('Tenant', {
  business_name : {
    type : DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subscription_plan : {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {timestamps: true});

const User = conn.define('User', {
  email : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password : {
    type: DataTypes.STRING,
    allowNull: false
  },
  tenant_id : {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  law_787_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')){
        const saltRounds = 12;
        const pepper = process.env.AUTH_DB_PEPPER;

        // Safety check for pepper
        if (!pepper) {
          throw new Error("SECRET_MANAGEMENT_ERROR: Pepper is not defined in .env");
        }

        const passwordWithPepper = password + pepper;
        user.password = await bcrypt.hash(passwordWithPepper, saltRounds);
      }
    }
  },
  timestamps: true
}
);

User.belongsTo(Tenant, {foreignKey: 'tenant_id'});

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
  const { email, password } = request.body;

  const user = await User.findOne({where : { email }});
  const pepper = process.env.AUTH_DB_PEPPER;

  const isMatch = await bcrypt.compare(password + pepper, user.password);

  // Aquí vamos a validar con la database
  if (isMatch) {
    const token = fastify.jwt.sign({ 
      user_id,
      email, 
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

