// Sistema temporal para almacenar códigos de verificación pendientes
class VerificationStore {
    constructor() {
        this.pendingVerifications = new Map();
        // Limpiar códigos expirados cada 5 minutos
        setInterval(() => {
            this.cleanExpiredCodes();
        }, 5 * 60 * 1000);
    }

    // Almacenar código de verificación temporal
    storePendingVerification(email, verificationData) {
        this.pendingVerifications.set(email.toLowerCase(), {
            ...verificationData,
            createdAt: new Date()
        });
    }

    // Obtener datos de verificación pendiente
    getPendingVerification(email) {
        return this.pendingVerifications.get(email.toLowerCase());
    }

    // Eliminar verificación pendiente
    removePendingVerification(email) {
        this.pendingVerifications.delete(email.toLowerCase());
    }

    // Verificar si el código es válido
    verifyCode(email, inputCode) {
        const pendingData = this.getPendingVerification(email);

        if (!pendingData) {
            return { valid: false, error: 'No hay verificación pendiente para este email' };
        }

        // Verificar expiración (15 minutos)
        const now = new Date();
        const expireTime = new Date(pendingData.createdAt.getTime() + 15 * 60 * 1000);

        if (now > expireTime) {
            this.removePendingVerification(email);
            return { valid: false, error: 'El código de verificación ha expirado' };
        }

        // Verificar código
        if (pendingData.verificationCode !== inputCode.toUpperCase()) {
            return { valid: false, error: 'Código de verificación inválido' };
        }

        return { valid: true, data: pendingData };
    }

    // Limpiar códigos expirados
    cleanExpiredCodes() {
        const now = new Date();
        for (const [email, data] of this.pendingVerifications.entries()) {
            const expireTime = new Date(data.createdAt.getTime() + 15 * 60 * 1000);
            if (now > expireTime) {
                this.pendingVerifications.delete(email);
            }
        }
    }

    // Obtener estadísticas (para debug)
    getStats() {
        return {
            totalPending: this.pendingVerifications.size,
            emails: Array.from(this.pendingVerifications.keys())
        };
    }
}

export default new VerificationStore();