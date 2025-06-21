import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from './images/icmc_tasks_logo.png';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Enviando dados:', { email: form.email }); // Debug
      
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email: form.email,
        senha: form.senha
      });

      console.log('Resposta da API:', response.data); // Debug

      // Pegando o userId retornado pela API
      const { userId, user } = response.data;

      if (!userId) {
        throw new Error('UserId não retornado pela API');
      }

      // Salvar no localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', user?.nome || '');
      localStorage.setItem('userPhoto', user?.fotoPerfil || '');

      
      // Redirecionar
      navigate('/inicio');
      
    } catch (err) {
      console.error('Erro no login:', err);
      
      // Tratamento de diferentes tipos de erro
      if (err.response) {
        // Erro da API
        const errorMsg = err.response.data?.error || 'Erro ao fazer login';
        setError(errorMsg);
      } else if (err.request) {
        // Erro de rede
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        // Outros erros
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="ICMC Tasks" className="login-logo" />
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{
              color: 'red',
              marginBottom: '10px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                disabled={loading}
              />
              Lembrar de mim
            </label>
            <Link to="/forgot" className="forgot-link">Esqueceu a senha?</Link>
          </div>
          
          <button 
            type="submit"
            className="btn login"
            disabled={loading}
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}