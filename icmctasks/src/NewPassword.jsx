import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPassword.css';
import logo from './images/icmc_tasks_logo.png';

export default function NewPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (form.newPassword !== form.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (form.newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    console.log('Nova senha definida:', form.newPassword);
    
    alert('Senha alterada com sucesso!');
    navigate('/login');
  };

  return (
    <div className="newpassword-page">
      <div className="newpassword-card">
        <img src={logo} alt="ICMC Tasks" className="newpassword-logo" />
        <p className="newpassword-text">Defina sua nova senha</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="Nova senha"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nova senha"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button
            type="submit"
            className="btn newpassword-btn"
          >
            ALTERAR SENHA
          </button>
        </form>
      </div>
    </div>
  );
}