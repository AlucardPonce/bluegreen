import React from "react";
import FormLogin from "./FormLogin";
import imagenLogin from '../../assets/imagenLogin.jpg';

function Login() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${imagenLogin})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: 'clamp(30px, 5vw, 50px)',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: '0 0 10px 0'
          }}>
            Experiencias Arroyo
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#7f8c8d',
            margin: '0'
          }}>
            Bienvenido a Descubrir Arroyo Seco
          </p>
        </div>
        <FormLogin />
      </div>
    </div>
  );
}

export default Login;
