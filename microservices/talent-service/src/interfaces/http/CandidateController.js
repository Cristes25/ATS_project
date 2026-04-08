const ingestCandidate = require('../../core/useCases/IngestCandidate');
const { Application } = require('../../core/domain/models');

class CandidateController {

    /**
     * POST /api/v1/talents/apply
     * Postulación Externa Directa (RF-12)
     */
    async applyPublic(request, reply) {
        const { rawCvText, s3Url, law787Accepted } = request.body;
        
        try {
            // Este endpoint asume que el candidato se auto-ingresa (Tenant opcional/asignado por URL)
            const result = await ingestCandidate.execute({
                rawCvText,
                s3Url,
                law787Accepted,
                tenantId: request.tenantId || null // Depende de la lógica del link
            });
            return reply.code(201).send(result);
        } catch (error) {
            request.log.error('Error aplicando en perfil público:', error);
            if (error.message.includes('Ley 787')) {
                return reply.code(403).send({ error: error.message });
            }
            return reply.code(500).send({ error: 'Fallo al procesar postulación pública' });
        }
    }

    /**
     * POST /api/v1/talents/upload
     * Carga Manual por Reclutador (RF-13)
     */
    async uploadManual(request, reply) {
        const { rawCvText, s3Url } = request.body;
        const law787Accepted = true; // Si es reclutador, se asumen firmas físicas previas o B2B

        try {
            const result = await ingestCandidate.execute({
                rawCvText,
                s3Url,
                law787Accepted,
                tenantId: request.tenantId // Esto fue asegurado forzosamente por el Middleware JWT!
            });
            return reply.code(201).send(result);
        } catch (error) {
            request.log.error('Error en carga manual:', error);
            return reply.code(500).send({ error: 'Fallo al procesar carga manual' });
        }
    }

    /**
     * PATCH /api/v1/talents/applications/:id/status
     * Gestiona el Pipeline (RF-16)
     */
    async updatePipelineStatus(request, reply) {
        const { id } = request.params;
        const { newStatus } = request.body; // ej. 'entrevista'

        try {
            const application = await Application.findByPk(id);
            if (!application) {
                return reply.code(404).send({ error: 'Postulación no encontrada' });
            }

            // (En caso extendido, aquí se comprobaría si el request.tenantId es el dueño de esta postulación)
            
            application.status = newStatus;
            await application.save();

            return reply.code(200).send({
                message: 'Estado del pipeline actualizado',
                status: application.status
            });

        } catch (error) {
            request.log.error('Fallo moviendo pipeline:', error);
            return reply.code(500).send({ error: 'Fallo en la Base de Datos.' });
        }
    }
}

module.exports = new CandidateController();
