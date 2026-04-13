const nodeMailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Simulador de SMTP para la demo :p
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    }
});

exports.sendInvitationEmail = async (email, link) => {
    await transport.sendMail({
        from: 'APPLIK Support <support@applik.ni>',
        to: email,
        subject: "Invitación a equipo de reclutamiento [APPLIK]",
        html: `<p>Has sido invitad@ a unirte a una empresa en APPLIK.<p>
        <a href="${link}">Haz clic aquí para completar tu registro</a>`
    });
}

