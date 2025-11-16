// services/emailService.js
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
    constructor() {
        // Ya no necesitas el transporter de nodemailer
    }

    // Generar código de verificación (MANTIENE IGUAL)
    generateVerificationCode() {
        return crypto.randomBytes(3).toString('hex').toUpperCase(); // Código de 6 caracteres
    }

    // Enviar email de verificación de registro (ACTUALIZADO)
    async sendEmailVerification(email, firstName, verificationCode) {
        try {
            const msg = {
                to: email,
                from: {
                    email: process.env.SENDGRID_VERIFIED_EMAIL, // Tu email verificado en SendGrid
                    name: 'Experience Arrays' // Tu nombre de remitente
                },
                subject: 'Verifica tu cuenta - Experience Arrays',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333; text-align: center;">¡Bienvenido a Experience Arrays!</h2>
                        <p>Hola ${firstName},</p>
                        <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, por favor verifica tu correo electrónico usando el siguiente código:</p>

                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <h3 style="color: #007bff; font-size: 24px; margin: 0; letter-spacing: 2px;">
                                ${verificationCode}
                            </h3>
                        </div>

                        <p>Este código expira en 15 minutos por seguridad.</p>
                        <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            Este es un correo automático, por favor no respondas a este mensaje.
                        </p>
                    </div>
                `
            };

            // ENVÍO CON SENDGRID
            const result = await sgMail.send(msg);
            return { 
                success: true, 
                messageId: result[0].headers['x-message-id'] 
            };
        } catch (error) {
            console.error('Error enviando email de verificación:', error);
            throw new Error('Error al enviar el correo de verificación');
        }
    }

    // Enviar email de recuperación de contraseña (ACTUALIZADO)
    async sendPasswordReset(email, firstName, verificationCode) {
        try {
            const msg = {
                to: email,
                from: {
                    email: process.env.SENDGRID_VERIFIED_EMAIL, // MISMO EMAIL VERIFICADO
                    name: 'Experience Arrays'
                },
                subject: 'Recuperación de Contraseña - Experience Arrays',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a085; text-align: center;">Recuperación de Contraseña</h2>
                        <p>Hola ${firstName},</p>
                        <p>Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para crear una nueva contraseña:</p>

                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <h3 style="color: #16a085; font-size: 28px; margin: 0; letter-spacing: 3px;">
                                ${verificationCode}
                            </h3>
                        </div>

                        <p>Este código expira en 15 minutos por seguridad.</p>
                        <p style="color: #e74c3c; font-weight: bold;">Si no solicitaste restablecer tu contraseña, ignora este correo y tu contraseña permanecerá sin cambios.</p>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            Este es un correo automático, por favor no respondas a este mensaje.<br>
                            Experience Arrays
                        </p>
                    </div>
                `
            };

            // ENVÍO CON SENDGRID
            const result = await sgMail.send(msg);
            return { 
                success: true, 
                messageId: result[0].headers['x-message-id'] 
            };
        } catch (error) {
            console.error("Error enviando email de recuperación:", error);
            throw new Error("Error al enviar el correo de recuperación");
        }
    }
}

export default new EmailService();