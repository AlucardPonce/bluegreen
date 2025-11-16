import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { MailOutlined, SafetyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { verifyEmail, resendVerificationCode } from '../../service/authService';

function ModalCodigoRegistro({ visible, email, onClose, onSuccess }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null); // <-- 1. Nuevo estado para el error

  const handleVerify = async () => {
    // Limpiamos errores previos al intentar verificar
    setError(null);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor ingresa un código de 6 caracteres'); // Mostramos error en el modal
      return;
    }

    setLoading(true);
    try {
      const response = await verifyEmail(email, verificationCode);
      
      if (response.success) {
        message.success('¡Email verificado exitosamente!');
        setVerificationCode('');
        onSuccess();
      } else {
        // Si el backend responde con success: false pero sin lanzar un error
        setError(response.message || 'Código inválido o expirado.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      
      let errorMessage = 'Código inválido o expirado';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // <-- 2. Actualizamos el estado de error en lugar de usar message.error
      setError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null); // Limpiamos error al reenviar
    setResendLoading(true);
    try {
      const response = await resendVerificationCode(email);
      
      if (response.success) {
        message.success('Código reenviado exitosamente');
        setVerificationCode('');
      }
    } catch (error) {
      console.error('Resend failed:', error);
      setError('Error al reenviar el código. Intenta más tarde.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancel = () => {
    setVerificationCode('');
    setError(null); // <-- 3. Limpiamos el error al cerrar el modal
    onClose();
  };

  const handleInputChange = (e) => {
    if (error) {
      setError(null); // <-- 3. Limpiamos el error cuando el usuario escribe de nuevo
    }
    const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
      width={500}
      maskClosable={false}
      styles={{
        content: {
          borderRadius: '15px',
          padding: '0'
        }
      }}
    >
      <div style={{
        padding: 'clamp(30px, 5vw, 40px)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '60px',
          color: '#16a085',
          marginBottom: '20px'
        }}>
          <SafetyOutlined />
        </div>

        <h3 style={{
          fontSize: 'clamp(22px, 3vw, 26px)',
          fontWeight: '600',
          color: '#2c3e50',
          margin: '0 0 20px 0'
        }}>
          Verifica tu Correo
        </h3>

        <div style={{
          marginBottom: '30px'
        }}>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#7f8c8d',
            margin: '0 0 15px 0'
          }}>
            Hemos enviado un código de verificación a:
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#f8f9fa',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <MailOutlined style={{ color: '#16a085', fontSize: '18px' }} />
            <span style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: '600',
              color: '#2c3e50'
            }}>{email}</span>
          </div>
          <p style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: '#7f8c8d',
            margin: '0'
          }}>
            Ingresa el código de 6 caracteres para completar tu registro
          </p>
        </div>

        <div style={{
          marginBottom: '25px'
        }}>
          <Input
            value={verificationCode}
            onChange={handleInputChange}
            placeholder="Ej: A1B2C3"
            maxLength={6}
            size="large"
            autoFocus
            onPressEnter={handleVerify}
            style={{
              borderRadius: '8px',
              padding: '12px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '4px',
              fontWeight: 'bold',
              borderColor: error ? '#ff4d4f' : '#d9d9d9',
              borderWidth: '2px'
            }}
          />
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#fff2f0',
              borderRadius: '6px',
              border: '1px solid #ffccc7'
            }}>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              <span style={{
                fontSize: '14px',
                color: '#ff4d4f'
              }}>{error}</span>
            </div>
          )}
        </div>

        <div>
          <Button
            type="primary"
            onClick={handleVerify}
            loading={loading}
            disabled={loading || verificationCode.length !== 6}
            block
            size="large"
            style={{
              backgroundColor: '#16a085',
              borderColor: '#16a085',
              borderRadius: '8px',
              height: '45px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>

          <div style={{
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#7f8c8d',
              margin: '0 0 8px 0'
            }}>¿No recibiste el código?</p>
            <Button
              type="link"
              onClick={handleResend}
              loading={resendLoading}
              disabled={resendLoading}
              style={{
                color: '#16a085',
                fontWeight: '600',
                fontSize: '15px',
                padding: '0',
                height: 'auto'
              }}
            >
              Reenviar código
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalCodigoRegistro;