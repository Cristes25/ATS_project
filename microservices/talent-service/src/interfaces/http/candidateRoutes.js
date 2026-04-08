const candidateController = require('./CandidateController');
const tenantInterceptor = require('../middleware/tenantInterceptor');

async function routes(fastify, options) {
    // Registramos el interceptor de Privacidad
    fastify.register(tenantInterceptor);

    // Endpoints
    // Exento de token por tener 'public' en su path 
    fastify.post('/public/apply', candidateController.applyPublic); 
    
    // Requiere JWT obligatorio con filtro tenant_id
    fastify.post('/upload', candidateController.uploadManual);
    
    // Requiere JWT 
    fastify.patch('/applications/:id/status', candidateController.updatePipelineStatus);
}

module.exports = routes;
