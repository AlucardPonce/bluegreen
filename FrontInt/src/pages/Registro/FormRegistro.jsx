import React, { useState } from 'react';
import { register } from '../../service/authService';
import { Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined} from '@ant-design/icons';
import ModalCodigoRegistro from './ModalCodigoRegistro';

function FormRegistro() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [form] = Form.useForm();
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Enviando datos de registro:', values);
      const response = await register(values);
      console.log('Registro response:', response);

      if (response.success) {
        message.success('Código de verificación enviado a tu correo');
        setUserEmail(values.email);
        setModalVisible(true);
      }

    } catch (error) {
      console.error('Registro failed:', error);

      let errorMessage = 'Error en el registro. Intenta nuevamente.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Por favor completa todos los campos correctamente.');
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleVerificationSuccess = () => {
    setModalVisible(false);
    form.resetFields();
    setRegistrationComplete(true);
  };

  if (registrationComplete) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <CheckCircleOutlined style={{
          fontSize: 'clamp(60px, 10vw, 80px)',
          color: '#16a085',
          marginBottom: '20px'
        }} />
        <h3 style={{
          fontSize: 'clamp(22px, 3vw, 28px)',
          fontWeight: '600',
          color: '#2c3e50',
          margin: '20px 0 15px 0'
        }}>
          ¡Registro Completado!
        </h3>
        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#7f8c8d',
          margin: '10px 0'
        }}>
          Bienvenido. Te has registrado correctamente.
        </p>
        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#7f8c8d',
          margin: '10px 0 30px 0'
        }}>
          Ya puedes iniciar sesión.
        </p>
        <Button
          type="primary"
          size="large"
          href="/login"
          style={{
            backgroundColor: '#16a085',
            borderColor: '#16a085',
            borderRadius: '8px',
            height: '45px',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '0 40px',
            boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)'
          }}
        >
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <Spin spinning={loading} tip="Procesando registro...">
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontWeight: '600',
              color: '#2c3e50',
              margin: '0'
            }}>
              Crear Cuenta
            </h2>
          </div>

          <Form
            form={form}
            name="registro"
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo!' },
                { type: 'email', message: 'Por favor ingresa un correo válido!' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#7f8c8d' }} />}
                placeholder="Correo electrónico"
                type="email"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: 'Por favor ingresa tu nombre!' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#7f8c8d' }} />}
                placeholder="Nombre"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: 'Por favor ingresa tus apellidos!' },
                { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#7f8c8d' }} />}
                placeholder="Apellido(s)"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña!' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#7f8c8d' }} />}
                placeholder="Contraseña"
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Por favor ingresa tu teléfono!' },
                { pattern: /^[0-9]{10}$/, message: 'El teléfono debe tener 10 dígitos!' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#7f8c8d' }} />}
                placeholder="Teléfono (10 dígitos)"
                maxLength={10}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
                style={{
                  backgroundColor: '#16a085',
                  borderColor: '#16a085',
                  borderRadius: '8px',
                  height: '45px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </Button>
            </Form.Item>

            <div style={{
              textAlign: 'center',
              marginTop: '15px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                ¿Ya tienes cuenta? <a href="/login" style={{
                  color: '#16a085',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>Inicia sesión aquí</a>
              </p>
            </div>
          </Form>
        </Spin>
      </div>

      <ModalCodigoRegistro
        visible={modalVisible}
        email={userEmail}
        onClose={handleModalClose}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
}

export default FormRegistro;