// src/components/Header/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo        from '../../images/icmc_tasks_logo.png';
import logoutIcon  from '../../images/logout.png';
import defaultPic  from '../../images/default-profile.png';

import './Header.css';

export default function Header({ userProfilePhoto, userName }) {
  const navigate = useNavigate();

  /* pega foto do localStorage se a prop vier vazia */
  const photo = userProfilePhoto || localStorage.getItem('userPhoto') || defaultPic;

  const handleLogout  = () => { localStorage.clear(); navigate('/'); };
  const handleProfile = () => navigate('/perfil');

  return (
    <header className="header">
      {/* ---------- logo ---------- */}
      <div className="logo-box" onClick={() => navigate('/inicio')}>
        <img src={logo} alt="ICMC Tasks" />
      </div>

      {/* ---------- perfil ---------- */}
      <div className="profile-box">
        <button className="profile-info" onClick={handleProfile}>
          <div className="avatar">
            <img src={photo} alt="Foto de perfil" />
          </div>
          {userName && <span className="name">{userName}</span>}
        </button>

        <button className="logout" onClick={handleLogout} title="Sair">
          <img src={logoutIcon} alt="Logout" />
        </button>
      </div>
    </header>
  );
}
