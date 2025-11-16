import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import './MainLayout.css';

const MainLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    return (
        <div className="main-layout">
            <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <main className="main-layout-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
