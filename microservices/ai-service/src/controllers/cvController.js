const asyncHandler = require('express-async-handler');
const cvService = require('../services/cvService');
const jobService = require('../services/jobService'); 

/**
 * @desc    Procesa raw text del cv
 * @route   POST /api/v1/cv/ingest-cv
 * @access  Private
 */
const ingestCvText = asyncHandler(async (req, res) => {
    const { cvText } = req.body;

    if (!cvText) {
        res.status(400); // Bad Request
        throw new Error('Texto del cv es requerido en el cuerpo de la solictitud .');
    }

    // capa de servicio maneja la logica 
    const structuredCv = await cvService.processAndStoreCv(cvText);

    res.status(201).json({
        message: "CV processed and stored successfully.",
        data: structuredCv
    });
});

/**
 * @desc    Ranquea una lista de aplicantes con una descripcion de puesto considerando fit cultural
 * @route   POST /api/v1/cv/rank-applicants
 * @access  Private
 */
const rankApplicants = asyncHandler(async (req, res) => {
    const { jobDescription, applicants, companyUrl } = req.body;

    // Validacion basica 
    if (!jobDescription || !applicants || !Array.isArray(applicants)) {
        res.status(400);
        throw new Error('Job description and a list of applicants are required.');
    }

    let cultureText = '';
    // Si existe una URL de la empresa, scrape para obtener informacion cultural 
    if (companyUrl) {
        try {
            cultureText = await jobService.scrapeCompanyCulture(companyUrl);
        } catch (error) {
            //Si el scrape falla, aun podemos proceder pero se logguea
            console.warn(`Aviso : No se pudo obtener informacion cultural de  ${companyUrl}. Procediendo con ranking tecnico unicamente.`);
            // Optionally, you could inform the client.
            // return res.status(400).json({ error: error.message });
        }
    }

    // Capa de servicio maneja la lofia 
    const rankedApplicants = await cvService.rankApplicants(jobDescription, applicants, cultureText);

    res.status(200).json({
        message: "Aplicantes ranqueados correctamente, considerando cultura de la empresa .",
        data: rankedApplicants
    });
});


module.exports = {
    ingestCvText,
    rankApplicants
};
