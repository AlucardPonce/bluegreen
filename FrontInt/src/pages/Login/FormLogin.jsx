import React, { useState } from 'react';
import { login } from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ModalRecuperarPassword from './ModalRecuperarPassword';

function FormLogin() {
  const [loading, setLoading] = useState(false);
  const [modalRecuperarVisible, setModalRecuperarVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Enviando datos:', values);
      const response = await login(values);
      console.log('Login successful:', response);

      // El backend devuelve los datos dentro de response.data
      if (response.data && response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        message.success('¡Inicio de sesión exitoso!');

        // Redirigir según el nivel de usuario
        const userLevel = user.userLevel || 'user';

        setTimeout(() => {
          if (userLevel === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/experiencia', { replace: true });
          }
        }, 100);
      } else {
        message.error('Error: No se recibió el token de autenticación');
      }

    } catch (error) {
      console.error('Login failed:', error);

      let errorMessage = 'Error en el inicio de sesión. Intenta nuevamente.';

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
    message.error('Por favor completa todos los campos requeridos.');
  };

  return (
    <div>
      <Spin spinning={loading} tip="Iniciando sesión...">
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
            Iniciar Sesión
          </h2>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
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
              prefix={<UserOutlined style={{ color: '#7f8c8d' }} />}
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

          <Form.Item style={{ marginBottom: '10px' }}>
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
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </Form.Item>

          <div style={{
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <Button
              type="link"
              onClick={() => setModalRecuperarVisible(true)}
              style={{
                color: '#16a085',
                fontWeight: '600',
                fontSize: '14px',
                padding: '0',
                height: 'auto'
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          <div style={{
            textAlign: 'center',
            borderTop: '1px solid #ecf0f1',
            paddingTop: '15px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              ¿No tienes cuenta? <a href="/registro" style={{
                color: '#16a085',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>Regístrate aquí</a>
            </p>
          </div>
        </Form>
      </Spin>

      <ModalRecuperarPassword
        visible={modalRecuperarVisible}
        onClose={() => setModalRecuperarVisible(false)}
      />
    </div>
  );
}

export default FormLogin;
