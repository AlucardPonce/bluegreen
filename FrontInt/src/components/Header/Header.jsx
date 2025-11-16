import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../utils/auth';
import './Header.css';
import { FaHouseUser } from "react-icons/fa";

const Header = ({ searchTerm, onSearchChange }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const user = getCurrentUser();

    const isActive = (path) => {
        return location.pathname.includes(path) ? 'nav-link active' : 'nav-link';
    };

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="mapa-app-header">
            <div className="header-left">
                <div className="logo-section">
                    <span className="logo-icon">🏞️</span>
                    <h2 className="logo-title">SIERRA
EXPLORA</h2>
                </div>
                <nav className="nav-desktop">
                    <Link to="/experiencia/inicio" className={isActive('/experiencia/inicio')}>Inicio</Link>
                    <Link to="/experiencia/atracciones" className={isActive('/experiencia/atracciones')}>Atracciones</Link>
                    <Link to="/experiencia/eventos" className={isActive('/experiencia/eventos')}>Eventos</Link>
                    <Link to="/experiencia/servicios" className={isActive('/experiencia/servicios')}>Servicios</Link>
                </nav>
            </div>
            <div className="header-right">
                <div className="search-container-header">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="search-input-header"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Link to="/experiencia/mapa" className="btn-icon-header" aria-label="Mapa">
                    🗺️
                </Link>
                
                {/* Avatar con menú desplegable */}
                <div className="avatar-container" ref={menuRef}>
                    <div 
                        className="avatar-header"
                        onClick={() => setMenuOpen(!menuOpen)}
                    ><div style={{ fontSize: 'clamp(33px, 1vw, 30px)', alignItems: 'center', marginBottom: '10px', color: '#dfd9cfff' }}><FaHouseUser /></div>{/*<div style={{ fontSize: 'clamp(25px, 5vw, 20px)', marginBottom: '10px', color: '#16a085' }}>🏠</div>*/}</div>

                    {/* Menú desplegable */}
                    {menuOpen && (
                        <div className="user-menu-dropdown">
                            <div className="user-menu-info">
                                <div className="user-menu-name">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="user-menu-email">
                                    {user?.email}
                                </div>
                            </div>

                            <div className="user-menu-divider"></div>

                            <button
                                onClick={handleLogout}
                                className="user-menu-logout"
                            >   
                                <span className="logout-icon">🚪</span>
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
