import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { forgotPassword, resetPassword } from '../../service/authService';

function ModalRecuperarPassword({ visible, onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: Código y nueva contraseña
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestCode = async () => {
    setError(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);

      if (response.success) {
        message.success('Código de recuperación enviado a tu correo');
        setStep(2);
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      setError(error.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor ingresa el código de 6 caracteres');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email, verificationCode, newPassword);

      if (response.success) {
        message.success('¡Contraseña actualizada exitosamente!');
        handleClose();
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      setError(error.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  };

  const handleCodeChange = (e) => {
    if (error) setError(null);
    const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
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
          {step === 1 ? <MailOutlined /> : <SafetyOutlined />}
        </div>

        <h3 style={{
          fontSize: 'clamp(22px, 3vw, 26px)',
          fontWeight: '600',
          color: '#2c3e50',
          margin: '0 0 20px 0'
        }}>
          {step === 1 ? 'Recuperar Contraseña' : 'Restablecer Contraseña'}
        </h3>

        {step === 1 ? (
          // Step 1: Solicitar código
          <>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#7f8c8d',
              margin: '0 0 25px 0',
              lineHeight: '1.6'
            }}>
              Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña
            </p>

            <div style={{ marginBottom: '25px' }}>
              <Input
                value={email}
                onChange={(e) => {
                  if (error) setError(null);
                  setEmail(e.target.value);
                }}
                placeholder="Correo electrónico"
                prefix={<MailOutlined style={{ color: '#7f8c8d' }} />}
                size="large"
                type="email"
                autoFocus
                onPressEnter={handleRequestCode}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
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
                  <span style={{ fontSize: '14px', color: '#ff4d4f' }}>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="primary"
              onClick={handleRequestCode}
              loading={loading}
              disabled={loading}
              block
              size="large"
              style={{
                backgroundColor: '#16a085',
                borderColor: '#16a085',
                borderRadius: '8px',
                height: '45px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </Button>
          </>
        ) : (
          // Step 2: Ingresar código y nueva contraseña
          <>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#7f8c8d',
              margin: '0 0 15px 0'
            }}>
              Código enviado a: <strong>{email}</strong>
            </p>

            <div style={{ marginBottom: '25px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#7f8c8d',
                marginBottom: '8px',
                textAlign: 'left'
              }}>Código de verificación</label>
              <Input
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Ej: A1B2C3"
                maxLength={6}
                size="large"
                autoFocus
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}
              />

              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#7f8c8d',
                marginBottom: '8px'
              }}>Nueva contraseña</label>
              <Input.Password
                value={newPassword}
                onChange={(e) => {
                  if (error) setError(null);
                  setNewPassword(e.target.value);
                }}
                placeholder="Mínimo 6 caracteres"
                prefix={<LockOutlined style={{ color: '#7f8c8d' }} />}
                size="large"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  marginBottom: '15px'
                }}
              />

              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#7f8c8d',
                marginBottom: '8px'
              }}>Confirmar contraseña</label>
              <Input.Password
                value={confirmPassword}
                onChange={(e) => {
                  if (error) setError(null);
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Repite la contraseña"
                prefix={<LockOutlined style={{ color: '#7f8c8d' }} />}
                size="large"
                onPressEnter={handleResetPassword}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
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
                  <span style={{ fontSize: '14px', color: '#ff4d4f' }}>{error}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                onClick={() => setStep(1)}
                size="large"
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  height: '45px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Volver
              </Button>
              <Button
                type="primary"
                onClick={handleResetPassword}
                loading={loading}
                disabled={loading}
                size="large"
                style={{
                  flex: 2,
                  backgroundColor: '#16a085',
                  borderColor: '#16a085',
                  borderRadius: '8px',
                  height: '45px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)'
                }}
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ModalRecuperarPassword;
