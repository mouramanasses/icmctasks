import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from './images/icmc_tasks_logo.png';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    dataNasc: '',
    cpf: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Preparar dados para o cadastro
      const registerPayload = {
        nome: form.nome,
        dataNascimento: form.dataNasc,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha
      };

      console.log('Enviando dados de cadastro:', registerPayload);

      // 1. Fazer o cadastro
      const registerResponse = await axios.post(
        'http://localhost:3000/api/users/register', 
        registerPayload
      );

      console.log('Cadastro realizado:', registerResponse.data);

      // 2. Fazer login automático após cadastro bem-sucedido
      const loginResponse = await axios.post(
        'http://localhost:3000/api/users/login',
        {
          email: form.email,
          senha: form.senha
        }
      );

      console.log('Login automático realizado:', loginResponse.data);

      // 3. Salvar dados do usuário no localStorage
      const { userId, user } = loginResponse.data;
      
      if (!userId) {
        throw new Error('UserId não retornado após login');
      }

      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', user?.nome || form.nome);
      localStorage.setItem('userEmail', user?.email || form.email);

      // 4. Redirecionar diretamente para início
      console.log('Redirecionando para /inicio');
      navigate('/inicio');

    } catch (error) {
      console.error('Erro no processo:', error);
      
      // Tratamento de diferentes tipos de erro
      if (error.response) {
        const errorMsg = error.response.data?.erro || 
                        error.response.data?.error || 
                        'Erro ao processar solicitação';
        setError(errorMsg);
      } else if (error.request) {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <img
          src={logo}
          alt="ICMC Tasks"
          className="register-logo"
        />

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{
              color: 'red',
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '14px',
              padding: '10px',
              backgroundColor: '#ffe6e6',
              borderRadius: '5px',
              border: '1px solid #ffcccc'
            }}>
              {error}
            </div>
          )}

          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="row">
            <input
              type="date"
              name="dataNasc"
              placeholder="Data de Nasc."
              value={form.dataNasc}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={form.cpf}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

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

          <button
            type="submit"
            className="btn cadastre"
            disabled={loading}
          >
            {loading ? 'CADASTRANDO...' : 'CADASTRE-SE'}
          </button>
        </form>
      </div>
    </div>
  );
}