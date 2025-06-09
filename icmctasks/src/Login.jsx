import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from './images/icmc_tasks_logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: '',
    remember: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: aqui você chamaria sua API de autenticação
    console.log('Dados de login:', form);
    // após login bem-sucedido, redirecione para a Home ou Dashboard
    navigate('/tasks');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="ICMC Tasks" className="login-logo" />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
          <div className="options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Lembrar de mim
            </label>
            <Link to="/forgot" className="forgot-link">Esqueceu a senha?</Link>
          </div>
          <button
           type="submit"
          className="btn login" > ENTRAR </button>
        </form>
      </div>
    </div>
  );
}
