const aiClient = require('../../infrastructure/aiBridge/AiClient');
const { CandidateProfile, WorkExperience, Education, Skill, CandidateSkill } = require('../domain/models');
const sequelize = require('../../infrastructure/database/sequelize');

class IngestCandidateUseCase {
    
    /**
     * Aplica el flujo complejo de Postulación pública o manual (RF-12, RF-13).
     * Requiere el texto del CV que ya fue parseado en una capa anterior (como S3 / Multer).
     */
    async execute({ rawCvText, s3Url, law787Accepted, tenantId }) {
        if (law787Accepted !== true) {
            throw new Error('La política de privacidad y tratamiento de datos (Ley 787) no fue aceptada.');
        }

        const transaction = await sequelize.transaction();

        try {
            // 1. Invocamos asíncronamente al AI Bridge (Integración de microservicios)
            const extractedData = await aiClient.extractCvData(rawCvText);

            if (!extractedData.personal_info) {
                throw new Error('El modelo generativo no logró estructurar este CV.');
            }

            // 2. Mock del App-level Auth ID (en el futuro esto lo da Auth-Service tras SignUp)
            const mockCandidateId = Math.floor(Math.random() * 1000000);

            // 3. Crear el Perfil Raíz
            const profile = await CandidateProfile.create({
                candidate_id: mockCandidateId, // Debe ligarse a la creación de usuario real después
                resume_url: s3Url || 'https://s3.dummy.url/cv.pdf',
                headline: extractedData.summary || 'Candidato CV Recibido',
                location: extractedData.personal_info.location || '',
                phone: extractedData.personal_info.phone || '',
                linkedin_url: extractedData.personal_info.email || '', // Usamos email de Fallback por ahora
                law_787_accepted: true
            }, { transaction });

            // 4. Procesar Experiencia Laboral (Y referencias extraídas por AI)
            if (extractedData.work_experiences && extractedData.work_experiences.length > 0) {
                const workExps = extractedData.work_experiences.map(exp => ({
                    profile_id: profile.id,
                    company_name: exp.company_name || 'Desconocido',
                    job_title: exp.job_title || 'Colaborador',
                    description: exp.description || '',
                    start_date: new Date(), // Requeriríamos un parser fino
                    is_current: false
                }));
                await WorkExperience.bulkCreate(workExps, { transaction });
            }

            // Nota: Aquí se procesarían también Educaciones y Skills...
            // Y aquí se encola el cálculo a pgvector del Match Score frente a una Vacante.

            await transaction.commit();
            return {
                status: 'success',
                message: 'Candidato ingestando y analizado con éxito',
                profile_id: profile.id,
                extracted_name: extractedData.personal_info.name
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new IngestCandidateUseCase();
