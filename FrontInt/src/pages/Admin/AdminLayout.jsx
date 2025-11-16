import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    SearchOutlined,
    ThunderboltOutlined,
    ShopOutlined,
    AppstoreOutlined,
    EnvironmentOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { logout, getCurrentUser } from '../../utils/auth';
import imagenLogin from '../../assets/imagenLogin.jpg';

const { Header, Sider, Content } = Layout;

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Mi Perfil',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Cerrar Sesión',
            onClick: handleLogout,
            danger: true,
        },
    ];

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin/dashboard'),
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Usuarios',
            onClick: () => navigate('/admin/users'),
        },
        {
            key: '/admin/restaurants',
            icon: <ShopOutlined />,
            label: 'Restaurantes',
            onClick: () => navigate('/admin/restaurants'),
        },
        {
            key: '/admin/dishes',
            icon: <AppstoreOutlined />,
            label: 'Platillos',
            onClick: () => navigate('/admin/dishes'),
        },
        {
            key: '/admin/attractions',
            icon: <EnvironmentOutlined />,
            label: 'Atracciones',
            onClick: () => navigate('/admin/attractions'),
        },
        {
            key: '/admin/eventos',
            icon: <CalendarOutlined />,
            label: 'Eventos',
            onClick: () => navigate('/admin/eventos'),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={240}
                collapsedWidth={80}
                style={{
                    background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
                }}
            >
                <div
                    style={{
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        borderBottom: '1px solid rgba(76, 175, 80, 0.2)',
                    }}
                >
                    {!collapsed ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#66bb6a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                            }}>
                                <DashboardOutlined style={{ fontSize: '20px', color: '#fff' }} />
                            </div>
                            <span style={{ color: '#2e7d32', fontSize: '16px', fontWeight: '700' }}>
                                Arroyo Seco
                            </span>
                        </div>
                    ) : (
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#66bb6a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                        }}>
                            <DashboardOutlined style={{ fontSize: '20px', color: '#fff' }} />
                        </div>
                    )}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        marginTop: '16px',
                    }}
                    className="sidebar-menu"
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'none',
                        height: '64px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            style: { fontSize: '20px', cursor: 'pointer', color: '#43a047' },
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#666' }} />

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '8px',
                                transition: 'background 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Avatar
                                    size={40}
                                    style={{
                                        backgroundColor: '#66bb6a',
                                    }}
                                    icon={<UserOutlined />}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#333', lineHeight: '1.2' }}>
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#999', lineHeight: '1.2' }}>
                                        {user?.role === 'admin' ? 'Admin' : 'Usuario'}
                                    </span>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content
                    style={{
                        padding: '32px',
                        minHeight: 280,
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(${imagenLogin})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>

            <style>{`
                .sidebar-menu .ant-menu-item {
                    margin: 4px 8px;
                    border-radius: 8px;
                    color: #2e7d32;
                    font-weight: 500;
                }
                .sidebar-menu .ant-menu-item-selected {
                    background-color: #66bb6a !important;
                    color: #fff !important;
                }
                .sidebar-menu .ant-menu-item-selected .ant-menu-item-icon {
                    color: #fff !important;
                }
                .sidebar-menu .ant-menu-item:hover {
                    background-color: rgba(102, 187, 106, 0.2);
                    color: #2e7d32;
                }
                .sidebar-menu .ant-menu-item .ant-menu-item-icon {
                    color: #43a047;
                }
            `}</style>
        </Layout>
    );
}

export default AdminLayout;
