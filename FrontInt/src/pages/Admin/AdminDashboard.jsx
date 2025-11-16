import React from 'react';
import { getCurrentUser } from '../../utils/auth';

function AdminDashboard() {
    const user = getCurrentUser();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
        }}>
            <div style={{
                textAlign: 'center',
                padding: '48px',
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: '#2e7d32',
                    margin: '0 0 16px 0',
                }}>
                    ¡Bienvenido!
                </h1>
                <p style={{
                    fontSize: '20px',
                    color: '#666',
                    margin: 0,
                }}>
                    Hola <strong style={{ color: '#43a047' }}>{user?.firstName}</strong>, estás en el panel de administración
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;
