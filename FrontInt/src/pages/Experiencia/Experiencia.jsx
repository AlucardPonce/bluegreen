import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imagenHome from '../../assets/imagenHome.jpg';
import { logout, getCurrentUser } from '../../utils/auth';

function Experiencia() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getCurrentUser();
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `url(${imagenHome})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '30px 40px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          width: '90%',
          maxWidth: '900px'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontStyle: 'italic',
            margin: '0',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            fontWeight: '600'
          }}>
            Descubre de la<br/>
            Sierra Gorra Gorda Queretana
          </h1>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
          width: '90%',
          maxWidth: '900px',
          padding: '0 10px'
        }}>
          <button style={{
            backgroundColor: '#16a085',
            color: 'white',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '140px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Ver Tours
          </button>
          <button style={{
            backgroundColor: '#e67e22',
            color: 'white',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '180px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Reservar Alojamento
          </button>
          <button style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            flex: '1 1 auto',
            minWidth: '200px',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/experiencia/mapa')}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            📍 Mapa de Atracciones
          </button>
        </div>

        {/* Categories Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 'clamp(20px, 4vw, 40px)',
          borderRadius: '15px',
          width: '90%',
          maxWidth: '900px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#2c3e50',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            Explora por Categoría
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '25px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: 'clamp(35px, 5vw, 50px)', marginBottom: '10px', color: '#16a085' }}>⛰️</div>
              <div style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#2c3e50', fontWeight: '600' }}>Tours</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '25px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: 'clamp(35px, 5vw, 50px)', marginBottom: '10px', color: '#16a085' }}>🏠</div>
              <div style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#2c3e50', fontWeight: '600' }}>Alojamientos</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '25px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}onClick={() => navigate('/experiencia/restaurante')}
            >
              <div style={{ fontSize: 'clamp(35px, 5vw, 50px)', marginBottom: '10px', color: '#e67e22' }}>🍴</div>{/* servicio de restaurantes*/}
              <div style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#2c3e50', fontWeight: '600' }} >Gastronomía</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '25px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: 'clamp(35px, 5vw, 50px)', marginBottom: '10px', color: '#3498db' }}>🏄</div>
              <div style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#2c3e50', fontWeight: '600' }}>Actividades</div>
            </div>
          </div>

          {/* Social Icons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#e4405f',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📷</div>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#3b5998',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >📘</div>
            <div style={{
              fontSize: 'clamp(28px, 4vw, 35px)',
              color: '#1da1f2',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >🐦</div>
          </div>

          {/* Contact */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#7f8c8d',
            fontSize: 'clamp(13px, 2vw, 15px)',
            fontWeight: '500'
          }}>
            Contacto Rápido
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experiencia;