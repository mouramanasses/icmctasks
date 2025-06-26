import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewPassword.css';
import logo from './images/icmc_tasks_logo.png';

export default function NewPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
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

    setIsLoading(true);
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('Usuário não encontrado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      await axios.put(`http://localhost:3000/api/users/password/${userId}`, {
        newPassword: form.newPassword
      });

      alert('Senha alterada com sucesso!');
      navigate('/login');
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nova senha"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button
            type="submit"
            className="btn newpassword-btn"
            disabled={isLoading}
          >
            {isLoading ? 'ALTERANDO...' : 'ALTERAR SENHA'}
          </button>
        </form>
      </div>
    </div>
  );
}