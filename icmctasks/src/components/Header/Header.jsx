import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo        from '../../images/icmc_tasks_logo.png';
import logoutIcon  from '../../images/logout.png';
import defaultPic  from '../../images/default-profile.png';

import './Header.css';

export default function Header({ userProfilePhoto, userName }) {
  const navigate = useNavigate();
  
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  
  useEffect(() => {
    const updateUserData = () => {
      const photo = userProfilePhoto || localStorage.getItem('userPhoto') || defaultPic;
      const name = userName || localStorage.getItem('userName') || '';
      
      setCurrentPhoto(photo);
      setCurrentUserName(name);
    };
    
    updateUserData();
    
    window.addEventListener('storage', updateUserData);
    
    window.addEventListener('userPhotoUpdated', updateUserData);
    
    window.addEventListener('userDataUpdated', updateUserData);
    
    return () => {
      window.removeEventListener('storage', updateUserData);
      window.removeEventListener('userPhotoUpdated', updateUserData);
      window.removeEventListener('userDataUpdated', updateUserData);
    };
  }, [userProfilePhoto, userName]);

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
            <img src={currentPhoto} alt="Foto de perfil" />
          </div>
          {currentUserName && <span className="name">{currentUserName}</span>}
        </button>

        <button className="logout" onClick={handleLogout} title="Sair">
          <img src={logoutIcon} alt="Logout" />
        </button>
      </div>
    </header>
  );
}