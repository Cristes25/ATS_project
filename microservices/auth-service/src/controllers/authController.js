const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dotenv = require('dotenv').config();
// Agregamos Session a los modelos importados
const { Employee, Candidate, Tenant, Session, PasswordResetToken, sequelize } = require('../models');
const { verifyPassword, validatePasswordStrength } = require('../utils/passwordUtils');
const { validateNicaraguanRUC } = require('../utils/validationUtils');
const { checkIfUserExists } = require('../utils/userUtils');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Se necesitan middleware para validación de inputs.

exports.handleLogin = async (request, reply) => {
  const { email, password } = request.body;
  const pepper = process.env.AUTH_DB_PEPPER;
  let userType;

  try {
    // Buscamos al usuario en Employees
    let user = await Employee.findOne({ where: { email } });
    let isSubscriptionActive = null;

    // Si el usuario no está en Employees, buscar en Candidates
    if (!user) {
      user = await Candidate.findOne({ where: { email } });
      if (!user) return reply.code(401).send({ message: 'Credenciales inválidas' });

      userType = "candidate";
      user.tenant_id = null;
      user.role = "aplicante"; // IMPORTANTÍSIMO
    } else {
      const tenant = await Tenant.findOne({ where: { id: user.tenant_id } });
      if (!tenant) return reply.code(401).send({ message: 'Company information not found.' });

      isSubscriptionActive = tenant.active_subscription;
      userType = "employee";
    }

    // Movimos esto fuera del else para que evalúe a ambos tipos de usuario
    const isMatch = await verifyPassword(password, user.password);

    if (isMatch) {
      // Payload se define aquí !!!
      const jwtToken = request.server.jwt.sign({
        user_id: user.id,
        role: user.role,
        company_id: user.tenant_id,
        active_subscription: isSubscriptionActive,
      }, { expiresIn: "2h" });

      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 8);

      let sessionObject = {
        token: jwtToken,
        expires_at: sessionExpiry
      };

      if (userType === "employee") {
        sessionObject.employee_id = user.id;
      } else if (userType === "candidate") {
        sessionObject.candidate_id = user.id;
      } else {
        return reply.code(401).send({ message: 'Credenciales inválidas' });
      }

      await Session.create(sessionObject);

      return reply.send({ token: jwtToken });
    }

    return reply.code(401).send({ message: 'Credenciales inválidas' });

  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Error interno del servidor' });
  }
};

exports.handleRegisterApplicant = async (request, reply) => {
  const { email, password, first_name, last_name, law_787_accepted } = request.body;

  try {
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return reply.code(400).send({
        success: false,
        field: "password", // Le decimos al frontend qué campo falló
        message: passwordCheck.message
      });
    }

    if (!law_787_accepted) {
      console.error("El usuario no a aceptado la ley 787");
      return reply.code(400).send({ error: "El usuario no ha aceptado la ley 787" });
    }

    if (await checkIfUserExists(email)) {
      console.error(`Usuario con correo ${email} ya existe.`);
      return reply.code(400).send({ error: `Usuario con correo ${email} ya existe.` });
    }

    const createdApplicant = await Candidate.create({
      email,
      password,
      first_name,
      last_name,
      law_787_accepted
    });

    const payload = {
      user_id: createdApplicant.id,
      role: "aplicante",
      active_subscription: null,
      company_id: null,
    };

    const jwtToken = await reply.jwtSign(payload);

    const sessionExpiry = new Date();
    sessionExpiry.setHours(sessionExpiry.getHours() + 2);

    await Session.create({
      token: jwtToken,
      candidate_id: createdApplicant.id, // Corregido el typo aquí
      expires_at: sessionExpiry
    });

    return reply.code(201).send({
      success: true,
      message: `Se creó al usuario aplicante: ${createdApplicant.id}`,
      data: {
        user_id: createdApplicant.id,
        token: jwtToken
      }
    });

  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: `Algo salió mal al crear nuevo aplicante: ${error}`
    });
  }
};

exports.handleRegisterOrganization = async (request, reply) => {
  const { businessName, subscriptionPlan, RUC, adminEmail, first_name, last_name, password, law_787_accepted } = request.body;

  // Validación de input:
  if (!validateNicaraguanRUC(RUC)) {
    return reply.code(400).send({
      success: false,
      message: "Formato de RUC inválido (debe empezar con 'J' y tener 14 caracteres)."
    });
  }

  const rucExists = await Tenant.findOne({ where: { RUC } });
  if (rucExists) {
    return reply.code(409).send({ success: false, message: "Este RUC ya está registrado." });
  }

  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.isValid) {
    return reply.code(400).send({
      success: false,
      field: "password", // Le decimos al frontend qué campo falló
      message: passwordCheck.message
    });
  }

  // Validar Email único
  if (await checkIfUserExists(adminEmail)) {
    console.error(`Usuario con correo ${adminEmail} ya existe.`);
    return reply.code(400).send({
      success: false,
      message: `Usuario con correo ${adminEmail} ya existe.`
    });
  }

  // Validar ley aceptada
  if (!law_787_accepted) {
    console.error("El usuario admin no a aceptado la ley 787");
    return reply.code(400).send({
      success: false,
      message: "El usuario admin no ha aceptado la ley 787"
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Crear tenant
    const createdTenant = await Tenant.create({
      business_name: businessName,
      subscription_plan: 'básico', // hardcoded para demo
      RUC,
      active_subscription: true, // hardcoded para demo
    }, { transaction });

    // Crear usuario admin
    const createdAdmin = await Employee.create({
      email: adminEmail,
      first_name,
      last_name,
      password,
      tenant_id: createdTenant.id,
      role: "admin",
      law_787_accepted
    }, { transaction });

    await transaction.commit();

    // creando token para iniciar sesión del admin
    const payload = {
      user_id: createdAdmin.id,
      role: createdAdmin.role,
      company_id: createdTenant.id,
      active_subscription: createdTenant.active_subscription
    };

    const token = await reply.jwtSign(payload);

    // Create the session record
    const sessionExpiry = new Date();
    sessionExpiry.setHours(sessionExpiry.getHours() + 8);

    await Session.create({
      token: token,
      employee_id: createdAdmin.id,
      expires_at: sessionExpiry
    });

    return reply.code(201).send({
      success: true,
      message: `Se creó compañía: ${createdTenant.id} con usuario admin: ${createdAdmin.id}`,
      data: {
        tenant_id: createdTenant.id,
        admin_id: createdAdmin.id,
        token: token
      }
    });

  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    reply.code(500).send({
      success: false,
      message: `Error al registrar empresa, abortando cambios: ${error}`
    });
  }
};

exports.getMe = async (request, reply) => {
  try {
    const { role, user_id } = request.user;

    let responseData = {};

    if (role === "admin" || role === "reclutador") {
      const user = await Employee.findOne({
        where: { id: user_id },
        include: {
          model: Tenant,
          attributes: ['business_name']
        }
      });

      if (!user) return reply.code(404).send({ success: false, message: "Usuario no encontrado" });

      responseData = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        tenant_name: user.Tenant ? user.Tenant.business_name : null
      };

    } else if (role === "aplicante") {

      const user = await Candidate.findOne({ where: { id: user_id } });

      if (!user) return reply.code(404).send({ success: false, message: "Usuario no encontrado" });

      responseData = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        tenant_name: null
      }
    }

    return reply.code(200).send({
      success: true,
      data: responseData
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: "Error del servidor al recuperar información de usuario"
    })
  }
}

exports.handleLogout = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ success: false, message: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1];

    const deletedSession = await Session.destroy({
      where: { token: token }
    });

    if (deletedSession === 0) {
      return reply.code(400).send({ success: false, message: "Sesión no encontrada o ya cerrada" });
    }

    return reply.code(200).send({
      success: true,
      message: "Sesión cerrada exitosamente. Hasta Pronto."
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: "Error interno en el servidor al tratar de cerrar la sesión"
    })
  }
}

// ─── RECUPERACIÓN DE CONTRASEÑA ───────────────────────────────────────────────

exports.handleForgotPassword = async (request, reply) => {
  const { email } = request.body;

  try {
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      // Por seguridad respondemos 200 para no revelar si el email existe o no
      return reply.code(200).send({ message: 'Si ese correo está registrado, recibirás un enlace.' });
    }

    // Invalida tokens anteriores no usados del mismo usuario
    await PasswordResetToken.update(
      { used: true },
      { where: { employee_id: employee.id, used: false } }
    );

    // Genera token seguro de 32 bytes = 64 caracteres hex
    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await PasswordResetToken.create({
      token: rawToken,
      employee_id: employee.id,
      expires_at: expiresAt,
    });

    await sendPasswordResetEmail(email, rawToken);

    return reply.code(200).send({ message: 'Si ese correo está registrado, recibirás un enlace.' });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ success: false, message: 'Error interno al procesar la solicitud.' });
  }
};

exports.handleResetPassword = async (request, reply) => {
  const { token, newPassword } = request.body;
  const pepper = process.env.AUTH_DB_PEPPER;

  try {
    const resetRecord = await PasswordResetToken.findOne({ where: { token, used: false } });

    if (!resetRecord) {
      return reply.code(400).send({ error: 'Token inválido o ya utilizado.' });
    }

    if (new Date() > resetRecord.expires_at) {
      await resetRecord.update({ used: true });
      return reply.code(400).send({ error: 'Token expirado. Solicita uno nuevo.' });
    }

    const employee = await Employee.findByPk(resetRecord.employee_id);
    if (!employee) {
      return reply.code(404).send({ error: 'Usuario no encontrado.' });
    }

    // El hook beforeSave de Employee se encarga del hash + pepper automáticamente
    employee.password = newPassword + pepper;
    await employee.save();

    // Invalida el token usado
    await resetRecord.update({ used: true });

    return reply.code(200).send({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ success: false, message: 'Error interno al restablecer la contraseña.' });
  }
};

exports.handleDeleteAccount = async (request, reply) => {
  const { role, user_id } = request.user;

  if (role !== 'aplicante') {
    return reply.code(403).send({
      success: false,
      message: 'Acceso denegado: solo los candidatos/aplicantes pueden eliminar su cuenta de forma directa.'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const candidate = await Candidate.findByPk(user_id);
    if (!candidate) {
      await transaction.rollback();
      return reply.code(404).send({ success: false, message: 'Usuario no encontrado.' });
    }

    // 1. Llamar al talent-service para eliminar perfiles y postulaciones asociadas
    try {
      const axios = require('axios');
      const talentServiceUrl = process.env.TALENT_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'http://applik_talent:3002/api/v1/talents' 
          : 'http://localhost:3002/api/v1/talents');

      await axios.delete(`${talentServiceUrl}/candidates/${user_id}`, {
        headers: {
          Authorization: request.headers.authorization
        }
      });
    } catch (talentError) {
      // Si falla porque el perfil no existe (404), procedemos. Si es otro error de red/servidor, abortamos
      const status = talentError.response ? talentError.response.status : null;
      if (status !== 404) {
        request.log.error('Fallo en talent-service al borrar perfil de candidato:', talentError.message);
        throw new Error('Fallo al limpiar perfiles asociados en talent-service.');
      }
    }

    // 2. Eliminar el registro del candidato de la base de datos de Auth
    // Nota: Las sesiones asociadas se eliminarán automáticamente en cascada debido a la relación onDelete: 'CASCADE'
    await candidate.destroy({ transaction });

    await transaction.commit();

    return reply.code(200).send({
      success: true,
      message: 'Cuenta y todos los datos asociados eliminados permanentemente (Cumplimiento Ley 787).'
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: `Error al eliminar la cuenta: ${error.message}`
    });
  }
};

exports.handleUpdateMe = async (request, reply) => {
  const { role, user_id } = request.user;
  const { first_name, last_name } = request.body;

  // Validation: min length 2, max length 50 if provided
  if (first_name !== undefined) {
    if (typeof first_name !== 'string' || first_name.trim().length < 2 || first_name.trim().length > 50) {
      return reply.code(400).send({
        success: false,
        message: 'El nombre (first_name) debe tener entre 2 y 50 caracteres.'
      });
    }
  }

  if (last_name !== undefined) {
    if (typeof last_name !== 'string' || last_name.trim().length < 2 || last_name.trim().length > 50) {
      return reply.code(400).send({
        success: false,
        message: 'El apellido (last_name) debe tener entre 2 y 50 caracteres.'
      });
    }
  }

  try {
    let user;
    if (role === 'admin' || role === 'reclutador') {
      user = await Employee.findOne({
        where: { id: user_id },
        include: {
          model: Tenant,
          attributes: ['business_name']
        }
      });
    } else if (role === 'aplicante') {
      user = await Candidate.findOne({ where: { id: user_id } });
    }

    if (!user) {
      return reply.code(404).send({ success: false, message: 'Usuario no encontrado' });
    }

    const updates = {};
    if (first_name !== undefined) updates.first_name = first_name.trim();
    if (last_name !== undefined) updates.last_name = last_name.trim();

    await user.update(updates);

    const responseData = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      tenant_name: user.Tenant ? user.Tenant.business_name : null
    };

    return reply.code(200).send({
      success: true,
      data: responseData
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ success: false, message: 'Error al actualizar el perfil' });
  }
};

exports.handleChangePassword = async (request, reply) => {
  const { role, user_id } = request.user;
  const { currentPassword, newPassword } = request.body;

  if (!currentPassword || !newPassword) {
    return reply.code(400).send({
      success: false,
      message: 'La contraseña actual y la nueva son requeridas.'
    });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return reply.code(400).send({
      success: false,
      message: 'La nueva contraseña debe tener al menos 8 caracteres.'
    });
  }

  try {
    let user;
    if (role === 'admin' || role === 'reclutador') {
      user = await Employee.findByPk(user_id);
    } else if (role === 'aplicante') {
      user = await Candidate.findByPk(user_id);
    }

    if (!user) {
      return reply.code(404).send({ success: false, message: 'Usuario no encontrado' });
    }

    // Verify current password
    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      return reply.code(400).send({ success: false, message: 'La contraseña actual es incorrecta.' });
    }

    // El hook beforeSave agrega el pepper — asignar user.password = newPassword directamente
    user.password = newPassword;
    await user.save();

    return reply.code(200).send({
      message: 'Contraseña actualizada'
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ success: false, message: 'Error al cambiar la contraseña' });
  }
};