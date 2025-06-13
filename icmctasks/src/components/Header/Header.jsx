import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/icmc_tasks_logo.png';
import logoutIcon from '../../images/logout.png'; 
import defaultProfile from '../../images/default-profile.png'; 

import './Header.css';

const Header = ({ userProfilePhoto, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de logout
    navigate('/home');
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Ação ao clicar na área combinada
  };

  return (
    <header className="header-container">
      <div className="logo-container" onClick={() => navigate('/Profile')}>
        <img src={logo} alt="Logo ICMC Tasks" className="logo" />
      </div>

      <div className="profile-area">
        <div className="profile-info" onClick={handleProfileClick}>
          <div className="profile-photo-container">
            <img 
              src={defaultProfile} 
              alt="Foto do Perfil" 
              className="profile-photo"
            />
          </div>
          {userName && <span className="user-name">{userName}</span>}
      </div>


        <button className="logout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="Ícone de Logout" className="logout-icon" />
        </button>
      </div>
    </header>
  );
};

export default Header;