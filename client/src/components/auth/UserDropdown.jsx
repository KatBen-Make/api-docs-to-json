import React, { useState, useRef, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import './UserDropdown.css';
import { AccountCircle } from '@mui/icons-material';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useApi();
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="user-icon-button">
                <AccountCircle fontSize="large" />
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="user-info-dropdown">
                        <span>{user?.name}</span>
                    </div>
                    <button onClick={logout} className="logout-button-dropdown">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
