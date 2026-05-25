const authController = require('../controllers/authController');
const invitationController = require('../controllers/invitationController');

async function authRoutes(fastify, options) {

  // Ruta para iniciar sesión
  fastify.post('/login', authController.handleLogin);

  // Ruta para registrar aplicante
  fastify.post('/register', authController.handleRegisterApplicant);

  // Registrar organización, crea el tenant y un admin user en una sola tranacción
  fastify.post('/organizations/register', authController.handleRegisterOrganization);

  // Recuperación de contraseña
  fastify.post('/forgot-password', authController.handleForgotPassword);
  fastify.post('/reset-password', authController.handleResetPassword);
  

  // Ruta protegida para invitar nuevo usuario reclutador
  fastify.post('/invitations/create', {
    onRequest: [fastify.authenticate]
  }, invitationController.createInvitation)
  
  // Este lo llama el front al darle submit a un registration form desde el 
  fastify.post('/invitations/accept', invitationController.handleAcceptInvitation);

  // Para datos en el navbar, hidratar info de usuario.
  fastify.get('/me', {
    onRequest: [fastify.authenticate]
  }, authController.getMe);

  // Actualizar datos del usuario logueado
  fastify.patch('/me', {
    onRequest: [fastify.authenticate]
  }, authController.handleUpdateMe);

  // Cambio de contraseña para usuario autenticado
  fastify.post('/change-password', {
    onRequest: [fastify.authenticate]
  }, authController.handleChangePassword);

  fastify.post('/logout', {
    onRequest: [fastify.authenticate]
  }, authController.handleLogout);

  // DELETE /candidates/me (Cumplimiento Ley 787 de Derecho al Olvido)
  fastify.delete('/candidates/me', {
    onRequest: [fastify.authenticate]
  }, authController.handleDeleteAccount);
}

module.exports = authRoutes;